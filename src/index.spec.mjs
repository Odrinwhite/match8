import match8 from './index.mjs'
import chai from 'chai'
import R from 'ramda'

const expect = chai.expect

describe('index.js', () => {
    describe('match8', () => {
        it('should match numbers', () => {
            const fib = match8([0, 1, () => 1], [n => fib(n - 2) + fib(n - 1)])

            expect(fib(0)).to.equal(1)
            expect(fib(1)).to.equal(1)
            expect(fib(2)).to.equal(2)
            expect(fib(3)).to.equal(3)
            expect(fib(4)).to.equal(5)
        })

        it('should match booleans', () => {
            const negate = match8([false, () => true], [() => false])

            expect(negate(true)).to.equal(false)
            expect(negate(false)).to.equal(true)
            expect(negate(0)).to.equal(false)
            expect(negate('test')).to.equal(false)
        })

        it('should match strings', () => {
            const rotColors = match8(
                ['green', () => 'blue'],
                ['blue', () => 'red'],
                ['red', () => 'green'],
                [() => 'unknown'],
            )

            expect(rotColors('green')).to.equal('blue')
            expect(rotColors('blue')).to.equal('red')
            expect(rotColors('red')).to.equal('green')
            expect(rotColors('yellow')).to.equal('unknown')
            expect(rotColors(rotColors(rotColors('green')))).to.equal('green')
        })

        it('should match function', () => {
            const isNotANumber = num => typeof num !== 'number'
            const isEven = num => num % 2 === 0
            const isOdd = num => !isEven(num)

            const evenOrOdd = match8(
                [isNotANumber, () => 'not a number'],
                [isOdd, () => 'odd'],
                [isEven, () => 'even'],
            )

            expect(evenOrOdd(0)).to.equal('even')
            expect(evenOrOdd(1)).to.equal('odd')
            expect(evenOrOdd(2)).to.equal('even')
            expect(evenOrOdd(3)).to.equal('odd')
            expect(evenOrOdd(87343)).to.equal('odd')
            expect(evenOrOdd('test')).to.equal('not a number')
        })

        it('should match array of numbers', () => {
            const arrTest = match8(
                [[], () => 'empty'],
                [[0, 1, 2, 3], () => '0,1,2,3'],
                [[[4, 5, 6, 7]], () => '4,5,6,7'],
                [() => 'unknown'],
            )

            expect(arrTest([])).to.equal('empty')
            expect(arrTest([0, 1, 2, 3])).to.equal('0,1,2,3')
            expect(arrTest([[4, 5, 6, 7]])).to.equal('4,5,6,7')
            expect(arrTest([0, 1, 2])).to.equal('unknown')
        })

        it('should match array of functions', () => {
            const lessThan = val => num => num < val
            const between = (valA, valB) => num => num >= valA && num <= valB
            const greaterThan = val => num => num > val
            const tmpCheck = match8(
                [lessThan(20), () => 'freezing'],
                [between(20, 36), () => 'ok'],
                [greaterThan(36), () => 'too hot'],
            )

            expect(tmpCheck(-345)).to.equal('freezing')
            expect(tmpCheck(20)).to.equal('ok')
            expect(tmpCheck(36)).to.equal('ok')
            expect(tmpCheck(1000)).to.equal('too hot')
        })

        it('should match objects', () => {
            const isOne = num => num === 1
            const rotColors = match8(
                [{ type: 'A', val: 1 }, () => 'A1'],
                [{ type: 'A', val: 2 }, () => 'A2'],
                [{ type: 'B', val: isOne }, () => 'B1'],
                [{ type: 'A' }, () => 'A'],
                [{ type: 'B' }, () => 'B'],
                [() => ''],
            )

            expect(rotColors({ type: 'A', val: 1 })).to.equal('A1')
            expect(rotColors({ type: 'A', val: 2 })).to.equal('A2')
            expect(rotColors({ type: 'B', val: 1 })).to.equal('B1')
            expect(rotColors({ type: 'A', val: 3 })).to.equal('A')
            expect(rotColors({ type: 'B' })).to.equal('B')
            expect(rotColors({ type: 'C', val: 1 })).to.equal('')
            expect(rotColors({})).to.equal('')
        })
    })
})
