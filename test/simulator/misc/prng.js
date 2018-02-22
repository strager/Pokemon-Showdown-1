'use strict';

const assert = require('./../../assert');
const PRNG = require('./../../../sim/prng');

describe("shuffle", function () {
	describe("empty input", function () {
		const input = [];
		it("should shuffle to an empty array", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			const output = prng.shuffled(input);
			assert.deepStrictEqual(output, []);
		});
		it("should return a new array object", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			const output = prng.shuffled(input);
			assert.notStrictEqual(output, input);
		});
	});
	describe("single-item input", function () {
		const input = [42];
		it("should shuffle to itself", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			const output = prng.shuffled(input);
			assert.deepStrictEqual(output, [42]);
		});
	});
	describe("two-item input", function () {
		const input = [42, 9001];
		it("should shuffle to itself 50% of the time and the reverse 50% of the time", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			let numberOfSameOrderSamples = 0;
			let numberOfReverseOrderSamples = 0;
			for (let i = 0; i < 1000; ++i) {
				const output = prng.shuffled(input);
				assert.strictEqual(output.length, 2);
				if (output[0] === 42 && output[1] === 9001) {
					numberOfSameOrderSamples += 1;
				} else if (output[0] === 9001 && output[1] === 42) {
					numberOfReverseOrderSamples += 1;
				} else {
					assert.fail('Unexpected items in output');
				}
			}
			assert.bounded(numberOfSameOrderSamples, [460, 540], 'the shuffled array should be the same as the input 50% of the time');
			assert.bounded(numberOfReverseOrderSamples, [460, 540],  'the shuffled array should be the reverse of the input 50% of the time');
			assert.strictEqual(numberOfSameOrderSamples + numberOfReverseOrderSamples, 1000, 'the shuffled array should be a permutation of the input');
		});
	});
	describe("three-item input", function () {
		const input = ['a', 'b', 'c'];
		it("should shuffle items with equal probability", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			const samples = [];
			for (let i = 0; i < 1000; ++i) {
				const output = prng.shuffled(input);
				assert.strictEqual(output.length, 3);
				samples.push(output);
				assert.deepStrictEqual(output.slice().sort(), ['a', 'b', 'c'], 'the shuffled array should be a permutation of the input');
			}

			const sampleCountByFirstItem = {'a': 0, 'b': 0, 'c': 0};
			for (const sample of samples) {
				sampleCountByFirstItem[sample[0]] += 1;
			}
			assert.bounded(sampleCountByFirstItem['a'], [293, 373], `the shuffled array's first item should match the input array's first item 33% of the time`);
			assert.bounded(sampleCountByFirstItem['b'], [293, 373], `the shuffled array's first item should match the input array's second item 33% of the time`);
			assert.bounded(sampleCountByFirstItem['c'], [293, 373], `the shuffled array's first item should match the input array's third item 33% of the time`);

			const sampleCountBySecondItem = {'a': 0, 'b': 0, 'c': 0};
			for (const sample of samples) {
				sampleCountBySecondItem[sample[1]] += 1;
			}
			assert.bounded(sampleCountBySecondItem['a'], [293, 373], `the shuffled array's second item should match the input array's first item 33% of the time`);
			assert.bounded(sampleCountBySecondItem['b'], [293, 373], `the shuffled array's second item should match the input array's second item 33% of the time`);
			assert.bounded(sampleCountBySecondItem['c'], [293, 373], `the shuffled array's second item should match the input array's third item 33% of the time`);
		});
	});
	describe("many-item input with mixed types", function () {
		it("should not mutate the input", function () {
			const input = [1, 3, 'x', 2, 'asdf', 'qwerty', null, undefined];
			const prng = new PRNG([0, 0, 0, 0]);
			const output = prng.shuffled(input);
			assert.deepStrictEqual(input, [1, 3, 'x', 2, 'asdf', 'qwerty', null, undefined]);
		});
	});
});
