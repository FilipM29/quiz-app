import { atom } from 'jotai';
import { Quiz } from '../models/quiz';

export const quizState = atom<Quiz[]>([]);
