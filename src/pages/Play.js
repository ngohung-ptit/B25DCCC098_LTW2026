import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import Helpers from '../components/Helpers';
import { TIME_PER_QUESTION, EXTRA_TIME } from '../data';
import { calcScore, getRank } from '../utils';

const Play = ({
  questions = [],
  playerName = '',
  onAddHistory,
  selectedTopic = 'Tất cả',
  shuffleAnswers = false,
  speedBonusEnabled = false,
}) => {
  const navigate = useNavigate();

  const gameQuestions = useMemo(() => {
    if (selectedTopic && selectedTopic !== 'Tất cả') {
      return questions.filter((q) => q.topic === selectedTopic);
    }
    return questions;
  }, [questions, selectedTopic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [endReason, setEndReason] = useState(null);

  const [usedHelp5050, setUsedHelp5050] = useState(false);
  const [usedHelpTime, setUsedHelpTime] = useState(false);
  const [usedHelpLifebuoy, setUsedHelpLifebuoy] = useState(false);
  const [isLifebuoyActive, setIsLifebuoyActive] = useState(false);
  const [hiddenAnswerIndex, setHiddenAnswerIndex] = useState(null);

  const currentQuestionRef = useRef(null);
  const answersRef = useRef([]);
  const currentIndexRef = useRef(0);
  const endReasonRef = useRef(null);
  const isLifebuoyActiveRef = useRef(false);
  const timeLeftRef = useRef(20);

  const rawQuestion = gameQuestions[currentIndex];

  const currentQuestion = useMemo(() => {
    if (!rawQuestion) return null;
    if (!shuffleAnswers) return rawQuestion;

    const items = rawQuestion.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    const newOptions = items.map((it) => it.text);
    const newAnswer = items.findIndex((it) => it.originalIndex === rawQuestion.answer);

    return {
      ...rawQuestion,
      options: newOptions,
      answer: newAnswer,
    };
  }, [rawQuestion, shuffleAnswers]);

  currentQuestionRef.current = currentQuestion;
  answersRef.current = answers;
  currentIndexRef.current = currentIndex;
  endReasonRef.current = endReason;
  isLifebuoyActiveRef.current = isLifebuoyActive;
  timeLeftRef.current = timeLeft;

  useEffect(() => {
    const currentScore = calcScore(answers);
    document.title = `Câu ${currentIndex + 1}/${gameQuestions.length || 15} - ${currentScore} điểm`;

    return () => {
      document.title = 'Rung chuông vàng';
    };
  }, [currentIndex, answers, gameQuestions.length]);

  const handleFinishGame = (reason, finalAnswers) => {
    const finalScore = calcScore(finalAnswers);
    const finalRank = getRank(finalScore);
    const correctCount = finalAnswers.filter((a) => a.correct).length;

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

  useEffect(() => {
    if (status !== 'answering') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
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

  useEffect(() => {
    let timerId;

    if (status === 'locked') {
      timerId = setTimeout(() => {
        const q = currentQuestionRef.current;
        const isCorrect = selectedAnswer === q.answer;
        const hasLifebuoy = isLifebuoyActiveRef.current;

        const hasSpeedBonus = speedBonusEnabled && isCorrect && timeLeftRef.current >= 15;

        const ans = {
          id: q.id,
          level: q.level,
          correct: isCorrect,
          usedLifebuoy: !isCorrect && hasLifebuoy,
          speedBonus: hasSpeedBonus ? 5 : 0,
          questionIndex: currentIndexRef.current,
        };
        setAnswers((prevAns) => [...prevAns, ans]);

        if (hasLifebuoy) {
          setIsLifebuoyActive(false);
        }

        if (!isCorrect && !hasLifebuoy) {
          setEndReason('wrong');
        }

        setStatus('revealed');
      }, 2000);
    } else if (status === 'revealed') {
      timerId = setTimeout(() => {
        const latestAnswers = answersRef.current;
        const lastAnswer = latestAnswers[latestAnswers.length - 1];
        const canContinue = lastAnswer ? (lastAnswer.correct || lastAnswer.usedLifebuoy) : false;

        if (canContinue) {
          if (currentIndexRef.current < gameQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setHiddenAnswerIndex(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
          } else {
            const hasUsedLifebuoy = latestAnswers.some((a) => a.usedLifebuoy);
            const finishReason = hasUsedLifebuoy ? 'completed' : 'win';
            handleFinishGame(finishReason, latestAnswers);
          }
        } else {
          const reason = endReasonRef.current || 'wrong';
          handleFinishGame(reason, latestAnswers);
        }
      }, 1500);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [status, gameQuestions.length, selectedAnswer, speedBonusEnabled]);

  const handleSelectAnswer = (index) => {
    if (status !== 'answering') return;
    setSelectedAnswer(index);
    setStatus('locked');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'answering') return;
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      const ansIndex = keyMap[e.key];

      if (ansIndex !== undefined) {
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

  const handleUse5050 = () => {
    if (usedHelp5050 || status !== 'answering' || !currentQuestion) return;

    const wrongIndices = currentQuestion.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQuestion.answer);

    const randomIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    setHiddenAnswerIndex(randomIndex);
    setUsedHelp5050(true);
  };

  const handleUseTime = () => {
    if (usedHelpTime || status !== 'answering') return;
    setTimeLeft((prev) => prev + EXTRA_TIME);
    setUsedHelpTime(true);
  };

  const handleUseLifebuoy = () => {
    if (usedHelpLifebuoy || status !== 'answering') return;
    setIsLifebuoyActive(true);
    setUsedHelpLifebuoy(true);
  };

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
        totalQuestions={gameQuestions.length || 15}
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
        totalQuestions={gameQuestions.length || 15}
        selectedAnswer={selectedAnswer}
        status={status}
        onSelectAnswer={handleSelectAnswer}
        hiddenAnswerIndex={hiddenAnswerIndex}
      />
    </div>
  );
};

export default Play;
