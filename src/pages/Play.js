import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import Helpers from '../components/Helpers';
import { TIME_PER_QUESTION, EXTRA_TIME } from '../data';
import { calcScore, getRank } from '../utils';

const Play = ({ questions = [], playerName = '', onAddHistory }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // 'answering' | 'locked' | 'revealed'
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [endReason, setEndReason] = useState(null);

  // Quyền trợ giúp
  const [usedHelp5050, setUsedHelp5050] = useState(false);
  const [usedHelpTime, setUsedHelpTime] = useState(false);
  const [usedHelpLifebuoy, setUsedHelpLifebuoy] = useState(false);
  const [isLifebuoyActive, setIsLifebuoyActive] = useState(false);
  const [hiddenAnswerIndex, setHiddenAnswerIndex] = useState(null);

  // Refs để lưu giá trị mới nhất cho các callback / timer
  const currentQuestionRef = useRef(null);
  const answersRef = useRef([]);
  const currentIndexRef = useRef(0);
  const endReasonRef = useRef(null);
  const isLifebuoyActiveRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  currentQuestionRef.current = currentQuestion;
  answersRef.current = answers;
  currentIndexRef.current = currentIndex;
  endReasonRef.current = endReason;
  isLifebuoyActiveRef.current = isLifebuoyActive;

  // 1. Tiêu đề tab (document.title): Câu 7/15 - 70 điểm; rời màn hình thi trả lại "Rung chuông vàng"
  useEffect(() => {
    const currentScore = calcScore(answers);
    document.title = `Câu ${currentIndex + 1}/${questions.length || 15} - ${currentScore} điểm`;

    return () => {
      document.title = 'Rung chuông vàng';
    };
  }, [currentIndex, answers, questions.length]);

  // 2. Kết thúc lượt chơi: tính điểm, danh hiệu, lưu lịch sử và điều hướng sang /result
  const handleFinishGame = (reason, finalAnswers) => {
    const finalScore = calcScore(finalAnswers);
    const finalRank = getRank(finalScore);
    const correctCount = finalAnswers.filter((a) => a.correct).length;

    // Lưu vào lịch sử
    if (onAddHistory) {
      onAddHistory({
        id: Date.now(),
        name: playerName,
        score: finalScore,
        rank: finalRank,
        correctCount: correctCount,
        playedAt: new Date().toLocaleString('vi-VN'),
      });
    }

    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        score: finalScore,
        rank: finalRank,
        correctCount: correctCount,
        reason: reason,
      },
    });
  };

  // 3. Đồng hồ 20 giây (setInterval, chỉ chạy khi status === "answering")
  useEffect(() => {
    if (status !== 'answering') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          // Hết giờ
          const q = currentQuestionRef.current;
          if (q) {
            const hasLifebuoy = isLifebuoyActiveRef.current;
            const timeoutAns = {
              id: q.id,
              level: q.level,
              correct: false,
              usedLifebuoy: hasLifebuoy,
              questionIndex: currentIndexRef.current,
            };
            setAnswers((prevAns) => [...prevAns, timeoutAns]);

            if (hasLifebuoy) {
              setIsLifebuoyActive(false);
            } else {
              setEndReason('timeout');
            }
            setStatus('revealed');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [status, currentIndex]);

  // 4. Quản lý các bước chờ (status: locked -> 2s -> revealed -> 1.5s -> tiếp theo/kết thúc)
  useEffect(() => {
    let timerId;

    if (status === 'locked') {
      // Chờ 2 giây lộ kết quả
      timerId = setTimeout(() => {
        const q = currentQuestionRef.current;
        const isCorrect = selectedAnswer === q.answer;
        const hasLifebuoy = isLifebuoyActiveRef.current;

        const ans = {
          id: q.id,
          level: q.level,
          correct: isCorrect,
          usedLifebuoy: !isCorrect && hasLifebuoy,
          questionIndex: currentIndexRef.current,
        };
        setAnswers((prevAns) => [...prevAns, ans]);

        // Nếu bật phao thì dù đúng hay sai phao cũng hết hạn cho câu này
        if (hasLifebuoy) {
          setIsLifebuoyActive(false);
        }

        if (!isCorrect && !hasLifebuoy) {
          setEndReason('wrong');
        }

        setStatus('revealed');
      }, 2000);
    } else if (status === 'revealed') {
      // Chờ 1,5 giây
      timerId = setTimeout(() => {
        const latestAnswers = answersRef.current;
        const lastAnswer = latestAnswers[latestAnswers.length - 1];
        const canContinue = lastAnswer ? (lastAnswer.correct || lastAnswer.usedLifebuoy) : false;

        if (canContinue) {
          if (currentIndexRef.current < questions.length - 1) {
            // Sang câu tiếp theo
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setHiddenAnswerIndex(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
          } else {
            // Đã trả lời hết 15 câu
            const hasUsedLifebuoy = latestAnswers.some((a) => a.usedLifebuoy);
            const finishReason = hasUsedLifebuoy ? 'completed' : 'win';
            handleFinishGame(finishReason, latestAnswers);
          }
        } else {
          // Trả lời sai hoặc hết giờ mà không có phao
          const reason = endReasonRef.current || 'wrong';
          handleFinishGame(reason, latestAnswers);
        }
      }, 1500);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [status, questions.length, selectedAnswer]);

  // 5. Hàm chọn đáp án
  const handleSelectAnswer = (index) => {
    if (status !== 'answering') return;
    setSelectedAnswer(index);
    setStatus('locked');
  };

  // 6. Phím tắt 1, 2, 3, 4 để chọn A, B, C, D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'answering') return;
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      const ansIndex = keyMap[e.key];

      if (ansIndex !== undefined) {
        // Phím của đáp án đã bị ẩn thì không có tác dụng
        if (hiddenAnswerIndex !== null && ansIndex === hiddenAnswerIndex) {
          return;
        }
        handleSelectAnswer(ansIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, hiddenAnswerIndex]);

  // 7. Xử lý quyền trợ giúp: Loại 1 đáp án
  const handleUse5050 = () => {
    if (usedHelp5050 || status !== 'answering' || !currentQuestion) return;

    // Tìm các đáp án sai của câu hiện tại
    const wrongIndices = currentQuestion.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQuestion.answer);

    const randomIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    setHiddenAnswerIndex(randomIndex);
    setUsedHelp5050(true);
  };

  // 8. Xử lý quyền trợ giúp: Thêm 15 giây
  const handleUseTime = () => {
    if (usedHelpTime || status !== 'answering') return;
    setTimeLeft((prev) => prev + EXTRA_TIME);
    setUsedHelpTime(true);
  };

  // 9. Xử lý quyền trợ giúp: Phao cứu sinh
  const handleUseLifebuoy = () => {
    if (usedHelpLifebuoy || status !== 'answering') return;
    setIsLifebuoyActive(true);
    setUsedHelpLifebuoy(true);
  };

  // Chặn vào thẳng trang thi khi chưa có tên người chơi
  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (!currentQuestion) {
    return <div>Đang chuẩn bị câu hỏi...</div>;
  }

  const currentScore = calcScore(answers);

  return (
    <div className="play-page" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <ScoreBoard
        score={currentScore}
        currentIndex={currentIndex}
        answers={answers}
        totalQuestions={questions.length || 15}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Timer timeLeft={timeLeft} />

        <Helpers
          usedHelp5050={usedHelp5050}
          onUse5050={handleUse5050}
          usedHelpTime={usedHelpTime}
          onUseTime={handleUseTime}
          usedHelpLifebuoy={usedHelpLifebuoy}
          isLifebuoyActive={isLifebuoyActive}
          onUseLifebuoy={handleUseLifebuoy}
          status={status}
        />
      </div>

      <QuestionCard
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length || 15}
        selectedAnswer={selectedAnswer}
        status={status}
        onSelectAnswer={handleSelectAnswer}
        hiddenAnswerIndex={hiddenAnswerIndex}
      />
    </div>
  );
};

export default Play;
