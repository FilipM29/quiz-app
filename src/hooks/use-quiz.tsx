import { useContext } from 'react';
import useSWRImmutable from 'swr/immutable';
import { ConfigContext } from '../context/config-context';
import { Quiz } from '../models/quiz';
import { fetcher } from '../utils/common';

export const useQuiz = () => {
  const { apiHost, apiUrl } = useContext(ConfigContext);

  const { data: quizzes } = useSWRImmutable<Quiz[]>(
    `${apiHost}${apiUrl.quiz.findAll}`,
    fetcher
  );

  return { quizzes: quizzes ?? [] };
};
