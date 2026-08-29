import { expect, test } from '@rstest/core';
import { transposeChord, transposeLine} from './transposer.ts'

/* transposeChord tests for individual chord transpositions */
test('Major Chords up a whole step (+2)', () => {
    expect(transposeChord('C', 2)).toBe('D');
    expect(transposeChord('C#', 2)).toBe('D#');
    expect(transposeChord('E', 2)).toBe('F#');
    expect(transposeChord('B', 2)).toBe('C#');
});

test('Major Chords down a whole step (-2)', () => {
    expect(transposeChord('D', -2)).toBe('C');
    expect(transposeChord('D#', -2)).toBe('C#');
    expect(transposeChord('F#', -2)).toBe('E');
    expect(transposeChord('C#', -2)).toBe('B');
});

test('Minor Chords +4', () => {
    expect(transposeChord('Cm', 4)).toBe('Em');
    expect(transposeChord('C#m', 4)).toBe('Fm');
    expect(transposeChord('Fm', 4)).toBe('Am');
    expect(transposeChord('Bm', 4)).toBe('D#m');
});

test('Maj Chords -4', () => {
    expect(transposeChord('EM', -4)).toBe('CM');
    expect(transposeChord('Fmaj', -4)).toBe('C#maj');
    expect(transposeChord('A', -4)).toBe('F');
    expect(transposeChord('D#M', -4)).toBe('BM');
});

test('7th Chords +6', () => {
    expect(transposeChord('C7', 6)).toBe('F#7'); 
    expect(transposeChord('D7', 6)).toBe('G#7'); 
    expect(transposeChord('Emaj7', 6)).toBe('A#maj7'); 
    expect(transposeChord('Gmaj7', 6)).toBe('C#maj7'); 
});

test('Long space before chord', () => {
    expect(transposeChord('             C', 2)).toBe('D'); 
});

test('Chords with bass', () => {
    expect(transposeChord('G/B', 2)).toBe('A/C#'); 
    expect(transposeChord('C/E', 3)).toBe('D#/G'); 
});

test('Testing Edge Cases', () => {
    expect(transposeChord('E', 0)).toBe('E'); 
    expect(transposeChord('E', 12)).toBe('E'); 
    expect(transposeChord('X', 12)).toBe(undefined); 
});

test('Major Chords output flats', () => {
    expect(transposeChord('C#', 2, true)).toBe('Eb');
    expect(transposeChord('E', 2, true)).toBe('Gb');
    expect(transposeChord('B', 2, true)).toBe('Db');
});

/* transposeLine tests for chord line transpositions */
test('Normal Lines with a significant amount of space', () => {
    expect(transposeLine('C   Em   G', 2)).toBe('D   F#m  A')
    expect(transposeLine('B   C#m   E   F#', -4)).toBe('G   Am    C   D')

})

test('Normal Lines with only single spaces inbetween', () => {
    expect(transposeLine('C Em G', 2)).toBe('D F#m A')
    expect(transposeLine('B C#m E F#', -4)).toBe('G Am  C D')
})
