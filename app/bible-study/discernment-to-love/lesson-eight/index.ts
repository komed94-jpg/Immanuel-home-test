import { l8_opening } from "./opening";
import { l8_part_1 } from "./part_1";
import { l8_part_2 } from "./part_2";
import { l8_part_3 } from "./part_3";
import { l8_part_4 } from "./part_4";
import { l8_part_5 } from "./part_5";
import { l8_part_6 } from "./part_6";
import { l8_closing } from "./closing";

export const lessonEightPages = [
  l8_opening, l8_part_1, l8_part_2, l8_part_3, l8_part_4, l8_part_5, l8_part_6, l8_closing
];

export const lessonEightQuestionKeys: Record<string, string[]> = Object.fromEntries(
  lessonEightPages.map((page) => [page.key, page.questions.map((question) => question.key)])
);
