import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Book } from '../types';
import { bookStorage } from '../storage/bookStorage';

interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (bookData: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<boolean>;
  borrowBook: (id: string) => Promise<boolean>;
  returnBook: (id: string) => Promise<boolean>;
  getBookById: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const storedBooks = await bookStorage.getBooks();
    setBooks(storedBooks);
    setLoading(false);
  };

  const addBook = async (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
    };
    const updatedBooks = [newBook, ...books];
    setBooks(updatedBooks);
    await bookStorage.saveBooks(updatedBooks);
  };

  const updateBook = async (updatedBook: Book) => {
    const updatedBooks = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    setBooks(updatedBooks);
    await bookStorage.saveBooks(updatedBooks);
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    const bookToDelete = books.find((b) => b.id === id);
    if (!bookToDelete) return false;

    // Không cho xoá sách đang có người mượn (borrowed > 0)
    if (bookToDelete.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách "${bookToDelete.title}" đang có ${bookToDelete.borrowed} cuốn được mượn. Không thể xoá!`
      );
      return false;
    }

    const updatedBooks = books.filter((b) => b.id !== id);
    setBooks(updatedBooks);
    await bookStorage.saveBooks(updatedBooks);
    return true;
  };

  const borrowBook = async (id: string): Promise<boolean> => {
    const book = books.find((b) => b.id === id);
    if (!book) return false;

    const remaining = book.quantity - book.borrowed;
    if (remaining <= 0) {
      Alert.alert('Thông báo', 'Sách này đã hết, không thể cho mượn tiếp!');
      return false;
    }

    const updatedBooks = books.map((b) => {
      if (b.id === id) {
        return { ...b, borrowed: b.borrowed + 1 };
      }
      return b;
    });
    setBooks(updatedBooks);
    await bookStorage.saveBooks(updatedBooks);
    return true;
  };

  const returnBook = async (id: string): Promise<boolean> => {
    const book = books.find((b) => b.id === id);
    if (!book) return false;

    if (book.borrowed <= 0) {
      Alert.alert('Thông báo', 'Hiện tại không có cuốn sách nào đang được mượn để trả!');
      return false;
    }

    const updatedBooks = books.map((b) => {
      if (b.id === id) {
        return { ...b, borrowed: b.borrowed - 1 };
      }
      return b;
    });
    setBooks(updatedBooks);
    await bookStorage.saveBooks(updatedBooks);
    return true;
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find((b) => b.id === id);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        getBookById,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks phải được sử dụng trong BookProvider');
  }
  return context;
};
