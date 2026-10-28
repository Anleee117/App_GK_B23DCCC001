import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const STORAGE_KEY = '@LibraryApp:books';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Nhập môn Lập trình React Native',
    author: 'Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2022,
    quantity: 10,
    borrowed: 3,
  },
  {
    id: '2',
    title: 'Cơ sở Dữ liệu Nâng cao',
    author: 'Trần Thị B',
    category: 'Giáo trình',
    year: 2021,
    quantity: 5,
    borrowed: 5, // Còn lại = 0 để hiển thị nhãn "Hết sách"
  },
  {
    id: '3',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    category: 'Tiểu thuyết',
    year: 1988,
    quantity: 8,
    borrowed: 2,
  },
  {
    id: '4',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2001,
    quantity: 4,
    borrowed: 0, // borrowed = 0 để test nút Nhận trả disabled
  },
  {
    id: '5',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 1941,
    quantity: 12,
    borrowed: 4,
  },
];

export const bookStorage = {
  // Lấy danh sách sách từ AsyncStorage, nếu lần đầu thì khởi tạo 5 cuốn mẫu
  async getBooks(): Promise<Book[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Lần chạy đầu tiên: khởi tạo dữ liệu mẫu và lưu vào AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu sách:', error);
      return INITIAL_BOOKS;
    }
  },

  // Lưu danh sách sách vào AsyncStorage
  async saveBooks(books: Book[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu sách:', error);
    }
  },
};
