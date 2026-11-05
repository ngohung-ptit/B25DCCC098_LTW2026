import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import { calcScore, getRank } from './utils';

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
    expect(screen.getAllByRole('row')).toHaveLength(16);
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
      expect(screen.getByText(/Câu hỏi số 13 - CSS \(Khó, 30 điểm\)/)).toBeInTheDocument();
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

describe('Bài 2 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Hàm calcScore và getRank tính đúng điểm và danh hiệu', () => {
    const ans1 = [
      { id: 1, level: 1, correct: true },
      { id: 2, level: 1, correct: true },
      { id: 3, level: 1, correct: false },
    ];
    expect(calcScore(ans1)).toBe(20);
    expect(getRank(calcScore(ans1))).toBe('Cần cố gắng');

    const ans2 = [
      { id: 1, level: 1, correct: true },
      { id: 2, level: 1, correct: true },
      { id: 3, level: 1, correct: true },
      { id: 4, level: 1, correct: true },
      { id: 5, level: 1, correct: true },
      { id: 6, level: 2, correct: true },
      { id: 7, level: 2, correct: true },
      { id: 8, level: 2, correct: false },
    ];
    expect(calcScore(ans2)).toBe(90);
    expect(getRank(calcScore(ans2))).toBe('Cần cố gắng');

    expect(getRank(150)).toBe('Khá');
    expect(getRank(240)).toBe('Xuất sắc');
    expect(getRank(300)).toBe('Rung chuông vàng');
  });

  test('Mở thẳng /play khi chưa nhập tên thì tự chuyển về trang chủ', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/play']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Tên người chơi:')).toBeInTheDocument();
  });

  test('Trang chủ: Nút Vào thi bị khóa khi ô tên trống hoặc chỉ có dấu cách', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: 'Vào thi' });
    expect(submitBtn).toBeDisabled();

    const nameInput = screen.getByLabelText('Tên người chơi:');
    fireEvent.change(nameInput, { target: { value: '   ' } });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: 'An' } });
    expect(submitBtn).not.toBeDisabled();
  });

  test('Nhập tên "An", bấm Vào thi -> Vào màn hình thi với đầy đủ ScoreBoard, Timer, QuestionCard', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    expect(screen.getByText('Câu 1/15 · HTML · Dễ')).toBeInTheDocument();
    expect(screen.getByText('Còn 20 giây')).toBeInTheDocument();
    expect(screen.getByText('Điểm: 0')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Còn 19 giây')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Chọn B ở câu 1 -> Khóa nút, 2s sau lộ xanh, 1.5s sau sang câu 2/15, Điểm 10', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    expect(screen.getByText('Câu 1/15 · HTML · Dễ')).toBeInTheDocument();

    const btnB = screen.getByRole('button', { name: /B\. <img>/ });
    fireEvent.click(btnB);

    expect(btnB).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Câu 2/15 · CSS · Dễ')).toBeInTheDocument();
    expect(screen.getByText('Điểm: 10')).toBeInTheDocument();
    expect(screen.getByText('Còn 20 giây')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Ở câu 2 chọn A (sai) -> chuyển sang trang kết quả: "Bạn đã bị loại"', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    fireEvent.click(screen.getByRole('button', { name: /B\. <img>/ }));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Câu 2/15 · CSS · Dễ')).toBeInTheDocument();

    const btnA = screen.getByRole('button', { name: /A\. color/ });
    fireEvent.click(btnA);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByRole('heading', { name: 'Bạn đã bị loại' })).toBeInTheDocument();
    expect(screen.getByText('Người chơi: An')).toBeInTheDocument();
    expect(screen.getByText('Số câu trả lời đúng: 1')).toBeInTheDocument();
    expect(screen.getByText('Điểm: 10')).toBeInTheDocument();
    expect(screen.getByText('Danh hiệu: Cần cố gắng')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Hết giờ ở câu 1 -> chuyển sang trang kết quả: "Hết giờ!"', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    expect(screen.getByText('Câu 1/15 · HTML · Dễ')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(20000);
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByRole('heading', { name: 'Hết giờ!' })).toBeInTheDocument();
    expect(screen.getByText('Người chơi: An')).toBeInTheDocument();
    expect(screen.getByText('Số câu trả lời đúng: 0')).toBeInTheDocument();
    expect(screen.getByText('Điểm: 0')).toBeInTheDocument();
    expect(screen.getByText('Danh hiệu: Cần cố gắng')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Mở /result trực tiếp khi không có state thì chuyển về trang chủ', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/result']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });
  });
});

describe('Bài 3 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('Quyền trợ giúp: Loại 1 đáp án làm ẩn 1 đáp án sai và khóa nút trợ giúp', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    const btn5050 = screen.getByRole('button', { name: 'Loại 1 đáp án' });
    expect(btn5050).not.toBeDisabled();

    fireEvent.click(btn5050);

    expect(btn5050).toBeDisabled();

    expect(screen.getByRole('button', { name: /B\. <img>/ })).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const hiddenButtons = buttons.filter((b) => b.classList.contains('answer-hidden'));
    expect(hiddenButtons).toHaveLength(1);
  });

  test('Quyền trợ giúp: Thêm 15 giây cộng thời gian và đồng hồ hết màu đỏ', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    act(() => {
      jest.advanceTimersByTime(15000);
    });
    expect(screen.getByText('Còn 5 giây')).toBeInTheDocument();

    const btnTime = screen.getByRole('button', { name: 'Thêm 15 giây' });
    fireEvent.click(btnTime);

    expect(btnTime).toBeDisabled();
    expect(screen.getByText('Còn 20 giây')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Phím tắt: Bấm phím 2 chọn đáp án B giống như click chuột', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    fireEvent.keyDown(window, { key: '2' });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Câu 2/15 · CSS · Dễ')).toBeInTheDocument();
    expect(screen.getByText('Điểm: 10')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Phao cứu sinh: Bật phao rồi chọn sai thì không bị loại', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    const btnLifebuoy = screen.getByRole('button', { name: 'Phao cứu sinh' });
    fireEvent.click(btnLifebuoy);
    expect(screen.getByText('Phao đang bật')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /A\. <image>/ }));

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Câu 2/15 · CSS · Dễ')).toBeInTheDocument();
    expect(screen.getByText('Điểm: 0')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Lịch sử: Trang /history hiển thị đúng thống kê và danh sách sắp xếp giảm dần', async () => {
    const sampleHistory = [
      { id: 1, name: 'Bình', score: 100, rank: 'Khá', correctCount: 5, playedAt: '05/11/2026, 09:00:00' },
      { id: 2, name: 'An', score: 240, rank: 'Xuất sắc', correctCount: 12, playedAt: '05/11/2026, 09:30:00' },
    ];
    localStorage.setItem('ltw_rcv_history', JSON.stringify(sampleHistory));
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/history']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lịch sử các lượt chơi')).toBeInTheDocument();
    });

    expect(screen.getByText('Số lượt chơi: 2')).toBeInTheDocument();
    expect(screen.getByText('Điểm cao nhất: 240')).toBeInTheDocument();
    expect(screen.getByText('Điểm trung bình: 170')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('An');
    expect(rows[2]).toHaveTextContent('Bình');

    const clearBtn = screen.getByRole('button', { name: 'Xóa lịch sử' });
    fireEvent.click(clearBtn);

    expect(screen.getByText('Chưa có lượt chơi nào.')).toBeInTheDocument();
  });

  test('Kỷ lục ở trang chủ: Hiện kỷ lục khi có lịch sử, không hiện khi trống', async () => {
    const sampleHistory = [
      { id: 1, name: 'An', score: 240, rank: 'Xuất sắc', correctCount: 12, playedAt: '05/11/2026, 09:30:00' },
    ];
    localStorage.setItem('ltw_rcv_history', JSON.stringify(sampleHistory));
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Kỷ lục: 240 điểm - An')).toBeInTheDocument();
    });
  });

  test('Tiêu đề tab: Đổi theo câu và số điểm hiện có, trả lại Rung chuông vàng khi rời màn hình thi', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    expect(document.title).toBe('Câu 1/15 - 0 điểm');
  });
});

describe('Thử thách thêm Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Chọn chủ đề React ở trang chủ -> Chỉ thi 4 câu của React', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.change(screen.getByLabelText('Chủ đề thi (Thử thách thêm):'), { target: { value: 'React' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    expect(screen.getByText(/Câu 1\/5.*React/)).toBeInTheDocument();
  });

  test('Thưởng tốc độ: Trả lời đúng trong 5 giây đầu được cộng 5 điểm thưởng', async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rung chuông vàng' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tên người chơi:'), { target: { value: 'An' } });
    fireEvent.click(screen.getByLabelText(/Thưởng tốc độ/));
    fireEvent.click(screen.getByRole('button', { name: 'Vào thi' }));

    fireEvent.click(screen.getByRole('button', { name: /B\. <img>/ }));

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Điểm: 15')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Chiếc chuông vàng rung lên khi rung chuông vàng thành công', async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuestions });

    const winState = {
      name: 'An',
      score: 300,
      rank: 'Rung chuông vàng',
      correctCount: 15,
      reason: 'Chúc mừng! Bạn đã rung chuông vàng',
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/result', state: winState }]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Chúc mừng! Bạn đã rung chuông vàng' })).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Chiếc chuông vàng')).toBeInTheDocument();
  });
});
