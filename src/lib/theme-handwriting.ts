// Single-line pen strokes, in writing order; separate paths lift the pen for dots and crossbars.
const letters: Record<string, { width: number; strokes: string[] }> = {
  T: { width: 39, strokes: ["M2 17 C12 3 30 7 43 12 C47 14 48 9 45 8", "M28 10 C25 21 19 42 16 52 C14 59 7 60 5 55"] },
  C: { width: 38, strokes: ["M35 20 C44 3 22 3 11 19 C1 34 0 52 13 54 C22 56 31 49 37 43"] },
  a: { width: 25, strokes: ["M2 47 C7 36 19 27 22 33 C26 41 15 55 9 53 C1 50 11 31 22 33 C19 39 16 51 20 53 C24 55 28 49 30 46"] },
  d: { width: 26, strokes: ["M2 47 C8 34 20 28 23 34 C26 41 15 55 9 53 C0 49 10 31 23 34 C27 21 34 0 30 7 C26 16 16 48 21 53 C25 56 29 49 31 46"] },
  e: { width: 22, strokes: ["M1 47 C12 44 24 34 18 32 C12 29 3 42 5 49 C8 59 22 49 27 44"] },
  g: { width: 26, strokes: ["M2 47 C9 32 23 28 23 36 C22 44 13 55 8 52 C0 48 12 30 23 33 C19 44 15 65 8 72 C2 79 -5 72 2 66 C10 60 24 56 31 46"] },
  h: { width: 28, strokes: ["M1 47 C12 37 30 11 22 7 C14 3 9 35 5 53 C12 41 21 29 25 33 C30 37 18 51 23 54 C27 55 32 49 34 46"] },
  i: { width: 14, strokes: ["M1 47 C6 42 10 36 11 33 C8 40 5 51 9 53 C12 55 17 49 20 46", "M14 23 L14.5 22"] },
  l: { width: 18, strokes: ["M1 47 C10 39 30 11 22 7 C15 3 6 30 6 44 C5 60 17 53 23 46"] },
  n: { width: 28, strokes: ["M1 47 C7 40 10 34 11 33 L5 53 C12 43 21 28 26 33 C30 38 18 51 23 54 C27 55 32 49 34 46"] },
  o: { width: 25, strokes: ["M2 47 C9 36 21 27 23 35 C26 43 15 56 9 53 C0 49 8 32 18 32 C19 42 26 44 31 40"] },
  r: { width: 22, strokes: ["M1 47 C8 40 12 32 11 30 C9 28 8 35 12 36 C17 38 22 30 21 34 C19 40 15 48 19 52 C22 55 27 49 28 46"] },
  s: { width: 22, strokes: ["M1 47 C8 40 15 34 17 29 C11 34 21 43 18 49 C13 60 2 53 8 49 C13 54 23 49 27 45"] },
  t: { width: 18, strokes: ["M1 47 C9 37 17 21 20 16 C16 29 6 50 12 54 C16 56 22 49 24 46", "M5 31 C11 30 20 31 26 28"] },
  v: { width: 26, strokes: ["M1 47 C9 39 11 30 10 33 C6 43 5 54 12 53 C20 51 30 34 25 31 C21 28 22 43 32 39"] },
  ",": { width: 12, strokes: ["M7 52 C10 54 7 60 3 62"] },
  ".": { width: 12, strokes: ["M7 53 L7.5 52"] },
};

export const themeScripture = "To live is Christ, to die is gain.";
export const themeStatement = "The message of DIG is not simply about death. It is about a life so completely identified with Christ that He becomes its purpose, its substance, and its ultimate hope.";

export const handwritingLines = ["To live is Christ,", "to die is gain."].map((line) => {
  let x = 0;
  const strokes = [...line].flatMap((letter) => {
    if (letter === " ") { x += 15; return []; }
    const glyph = letters[letter];
    if (!glyph) throw new Error(`Missing handwriting glyph: ${letter}`);
    const position = x;
    x += glyph.width;
    return glyph.strokes.map((path) => ({ path, x: position }));
  });
  return { strokes, width: x };
});

export const writingDuration = 4600;
export const writingStrokeCount = handwritingLines.reduce((count, line) => count + line.strokes.length, 0);
export const typingStart = writingDuration + 400;
export const typingInterval = 44;
export const typingCompletion = typingStart + themeStatement.replace(/\s/g, "").length * typingInterval + 100;
