import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

const mockQuestions = [
  { id: 1, topic: 'HTML', level: 1, question: 'Thẻ HTML nào dùng để chèn một hình ảnh?', options: ['<image>', '<img>', '<pic>', '<src>'], answer: 1 },
  { id: 2, topic: 'CSS', level: 1, question: 'Thuộc tính CSS nào dùng để đổi màu nền?', options: ['color', 'bg', 'background-color', 'fill'], answer: 2 },
  { id: 3, topic: 'HTML', level: 1, question: 'Thẻ HTML nào tạo một ô nhập liệu trong form?', options: ['<input>', '<form>', '<label>', '<option>'], answer: 0 },
  { id: 4, topic: 'JavaScript', level: 1, question: 'Kết quả của typeof "hello" là gì?', options: ['"text"', '"char"', '"object"', '"string"'], answer: 3 },
  { id: 5, topic: 'React', level: 1, question: 'Khi render danh sách bằng map() trong React, mỗi phần tử cần thuộc tính nào?', options: ['id', 'key', 'name', 'index'], answer: 1 },
  { id: 6, topic: 'CSS', level: 2, question: 'Giá trị display nào biến phần tử thành flex container?', options: ['block', 'inline', 'flex', 'grid-flex'], answer: 2 },
  { id: 7, topic: 'JavaScript', level: 2, question: '[1, 2, 3, 4].filter(x => x > 2) trả về kết quả nào?', options: ['[3, 4]', '[1, 2]', '2', 'true'], answer: 0 },
  { id: 8, topic: 'React', level: 2, question: 'Gọi setCount(count + 1) trong React có tác dụng gì?', options: ['Sửa trực tiếp biến count', 'Cập nhật state và render lại component', 'Tải lại cả trang web', 'Không có tác dụng'], answer: 1 },
  { id: 9, topic: 'JavaScript', level: 2, question: 'Toán tử nào so sánh bằng cả giá trị lẫn kiểu dữ liệu?', options: ['=', '==', '===', '!='], answer: 2 },
  { id: 10, topic: 'React', level: 2, question: 'Trong JSX, thuộc tính class của HTML phải viết thành gì?', options: ['class', 'cssClass', 'classList', 'className'], answer: 3 },
  { id: 11, topic: 'JavaScript', level: 3, question: 'const [x, , y] = [10, 20, 30]; y có giá trị nào?', options: ['20', '30', '10', 'undefined'], answer: 1 },
  { id: 12, topic: 'React', level: 3, question: 'Hook nào lấy được state đã gửi kèm khi gọi navigate("/result", { state })?', options: ['useParams', 'useNavigate', 'useLocation', 'useState'], answer: 2 },
  { id: 13, topic: 'CSS', level: 3, question: 'Selector CSS nào chọn các thẻ <p> là con trực tiếp của <div>?', options: ['div p', 'div > p', 'div + p', 'div ~ p'], answer: 1 },
  { id: 14, topic: 'JavaScript', level: 3, question: '[3, 1, 2].reduce((s, x) => s + x, 10) trả về kết quả nào?', options: ['6', '16', '10', '[3, 1, 2, 10]'], answer: 1 },
  { id: 15, topic: 'React', level: 3, question: 'Với useEffect(() => { ... }, [id]), hàm trong effect chạy lại khi nào?', options: ['Sau mỗi lần render', 'Chỉ một lần duy nhất', 'Khi giá trị id thay đổi', 'Khi component bị gỡ'], answer: 2 },
];

describe('Bài 1 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Hiển thị "Đang tải câu hỏi..." và sau đó hiển thị bảng 15 câu trên /questions', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/questions']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Đang tải câu hỏi...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Có 15 câu hỏi')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Ngân hàng câu hỏi' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(16); // 1 header + 15 rows
  });

  test('Lọc theo chủ đề JavaScript còn 5 câu', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/questions']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Có 15 câu hỏi')).toBeInTheDocument();
    });

    const topicSelect = screen.getByLabelText('Chủ đề:');
    fireEvent.change(topicSelect, { target: { value: 'JavaScript' } });

    expect(screen.getByText('Có 5 câu hỏi')).toBeInTheDocument();
  });

  test('Lọc "Tất cả" và tìm kiếm "TRẢ VỀ" còn 2 câu', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/questions']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Có 15 câu hỏi')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Tìm theo nội dung...');
    fireEvent.change(searchInput, { target: { value: 'TRẢ VỀ' } });

    expect(screen.getByText('Có 2 câu hỏi')).toBeInTheDocument();
  });

  test('Lọc chủ đề React và tìm kiếm "trong" còn 4 câu', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/questions']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Có 15 câu hỏi')).toBeInTheDocument();
    });

    const topicSelect = screen.getByLabelText('Chủ đề:');
    fireEvent.change(topicSelect, { target: { value: 'React' } });

    const searchInput = screen.getByPlaceholderText('Tìm theo nội dung...');
    fireEvent.change(searchInput, { target: { value: 'trong' } });

    expect(screen.getByText('Có 4 câu hỏi')).toBeInTheDocument();
  });

  test('Xem chi tiết câu hỏi 13: /questions/13', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/questions/13']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Câu hỏi số 13 – CSS \(Khó, 30 điểm\)/)).toBeInTheDocument();
    });

    expect(screen.getByText(/div > p/)).toBeInTheDocument();
    expect(screen.getByText(/Đáp án đúng/)).toBeInTheDocument();
  });

  test('Mở câu hỏi không tồn tại: /questions/0', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/questions/0']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy câu hỏi')).toBeInTheDocument();
    });
  });

  test('Mở trang không tồn tại: /abc hiển thị 404 và menu vẫn hiển thị', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/abc']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('404 - Không tìm thấy trang')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Ngân hàng câu hỏi' })).toBeInTheDocument();
    expect(screen.getByText('Về trang chủ')).toBeInTheDocument();
  });

  test('API bị lỗi thì hiển thị "Không tải được câu hỏi"', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter initialEntries={['/questions']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Không tải được câu hỏi')).toBeInTheDocument();
    });
  });
});
