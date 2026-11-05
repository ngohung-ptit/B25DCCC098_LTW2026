import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState('');

  const [selectedTopic, setSelectedTopic] = useState('Tất cả');
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [speedBonusEnabled, setSpeedBonusEnabled] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ltw_rcv_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ltw_rcv_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        setError('Không tải được câu hỏi');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const handleAddHistory = (record) => {
    setHistory((prev) => [record, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout loading={loading} error={error} />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              shuffleAnswers={shuffleAnswers}
              setShuffleAnswers={setShuffleAnswers}
              speedBonusEnabled={speedBonusEnabled}
              setSpeedBonusEnabled={setSpeedBonusEnabled}
            />
          }
        />
        <Route
          path="play"
          element={
            <Play
              questions={questions}
              playerName={playerName}
              onAddHistory={handleAddHistory}
              selectedTopic={selectedTopic}
              shuffleAnswers={shuffleAnswers}
              speedBonusEnabled={speedBonusEnabled}
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={
            <History
              history={history}
              onClearHistory={handleClearHistory}
            />
          }
        />
        <Route
          path="questions"
          element={<QuestionBank questions={questions} />}
        />
        <Route
          path="questions/:id"
          element={<QuestionDetail questions={questions} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
