import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import { TIME_PER_QUESTION } from '../data';
import { calcScore, getRank } from '../utils';

const Play = ({ questions = [], playerName = '' }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // 'answering' | 'locked' | 'revealed'
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [endReason, setEndReason] = useState(null);

  // Dùng ref để giữ giá trị mới nhất trong các timer callback
  const currentQuestionRef = useRef(null);
  const answersRef = useRef([]);
  const currentIndexRef = useRef(0);
  const endReasonRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  currentQuestionRef.current = currentQuestion;
  answersRef.current = answers;
  currentIndexRef.current = currentIndex;
  endReasonRef.current = endReason;

  // 1. Đồng hồ 20 giây (setInterval, chỉ chạy khi status === "answering")
  useEffect(() => {
    if (status !== 'answering') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          // Hết giờ
          const q = currentQuestionRef.current;
          if (q) {
            const timeoutAns = {
              id: q.id,
              level: q.level,
              correct: false,
              questionIndex: currentIndexRef.current,
            };
            setAnswers((prevAns) => [...prevAns, timeoutAns]);
            setEndReason('timeout');
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

  // Hàm kết thúc lượt chơi
  const handleFinishGame = (reason, finalAnswers) => {
    const finalScore = calcScore(finalAnswers);
    const finalRank = getRank(finalScore);
    const correctCount = finalAnswers.filter((a) => a.correct).length;

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

  // 2. Chờ 2 giây lộ kết quả và 1,5 giây sang câu tiếp / kết thúc lượt chơi
  useEffect(() => {
    let timerId;

    if (status === 'locked') {
      // Chờ 2 giây lộ kết quả
      timerId = setTimeout(() => {
        const q = currentQuestionRef.current;
        const isCorrect = selectedAnswer === q.answer;
        const ans = {
          id: q.id,
          level: q.level,
          correct: isCorrect,
          questionIndex: currentIndexRef.current,
        };
        setAnswers((prevAns) => [...prevAns, ans]);

        if (!isCorrect) {
          setEndReason('wrong');
        }
        setStatus('revealed');
      }, 2000);
    } else if (status === 'revealed') {
      // Chờ 1,5 giây
      timerId = setTimeout(() => {
        const latestAnswers = answersRef.current;
        const lastAnswer = latestAnswers[latestAnswers.length - 1];
        const isCorrect = lastAnswer ? lastAnswer.correct : false;

        if (isCorrect) {
          if (currentIndexRef.current < questions.length - 1) {
            // Sang câu tiếp theo
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
          } else {
            // Trả lời đúng cả 15 câu: Rung chuông vàng
            handleFinishGame('win', latestAnswers);
          }
        } else {
          // Trả lời sai hoặc hết giờ
          const reason = endReasonRef.current || 'wrong';
          handleFinishGame(reason, latestAnswers);
        }
      }, 1500);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [status, questions.length, selectedAnswer]);

  // Chặn vào thẳng trang thi khi chưa có tên người chơi
  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  // Nếu câu hỏi chưa tải xong
  if (!currentQuestion) {
    return <div>Đang chuẩn bị câu hỏi...</div>;
  }

  const handleSelectAnswer = (index) => {
    if (status !== 'answering') return;
    setSelectedAnswer(index);
    setStatus('locked');
  };

  const currentScore = calcScore(answers);

  return (
    <div className="play-page" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <ScoreBoard
        score={currentScore}
        currentIndex={currentIndex}
        answers={answers}
        totalQuestions={questions.length || 15}
      />

      <Timer timeLeft={timeLeft} />

      <QuestionCard
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length || 15}
        selectedAnswer={selectedAnswer}
        status={status}
        onSelectAnswer={handleSelectAnswer}
      />
    </div>
  );
};

export default Play;
