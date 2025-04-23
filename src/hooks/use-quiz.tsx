import { useAtom } from 'jotai';
import { useContext, useEffect } from 'react';
import useSWRImmutable from 'swr/immutable';
import { quizState } from '../atoms';
import { ConfigContext } from '../context/config-context';
import { Quiz } from '../models/quiz';
import { fetcher } from '../utils/common';

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useAtom(quizState);

  const { apiHost, apiUrl } = useContext(ConfigContext);

  const { data } = useSWRImmutable<Quiz[]>(
    !quizzes.length ? `${apiHost}${apiUrl.quiz.findAll}` : null,
    fetcher
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    (async () => {
      setQuizzes(data);
    })();
  }, [data, setQuizzes]);

  return { quizzes };
};
