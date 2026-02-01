import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { KeyboardIcon } from 'lucide-react'

export const CalculatorModal = () => {
    const [display, setDisplay] = useState('0')
    const [previous, setPrevious] = useState<string | null>(null)
    const [operation, setOperation] = useState<string | null>(null)

    const handleNumber = (num: string) => {
        if (display === '0') {
            setDisplay(num)
        } else {
            setDisplay(display + num)
        }
    }

    const handleOperation = (op: string) => {
        setPrevious(display)
        setOperation(op)
        setDisplay('0')
    }

    const handleEquals = () => {
        if (previous && operation) {
            const prev = parseFloat(previous)
            const curr = parseFloat(display)
            let result = 0

            switch (operation) {
                case '+':
                    result = prev + curr
                    break
                case '-':
                    result = prev - curr
                    break
                case '×':
                    result = prev * curr
                    break
                case '÷':
                    result = prev / curr
                    break
            }

            setDisplay(result.toString())
            setPrevious(null)
            setOperation(null)
        }
    }

    const handleClear = () => {
        setDisplay('0')
        setPrevious(null)
        setOperation(null)
    }

    const buttons = [
        ['7', '8', '9', '÷'],
        ['4', '5', '6', '×'],
        ['1', '2', '3', '-'],
        ['C', '0', '=', '+'],
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='w-full'>
                    <KeyboardIcon className='mr-2 h-4 w-4' />
                    Calculator
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Calculator</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <div className='rounded-lg bg-gray-100 p-4 text-right'>
                        <div className='text-2xl font-bold'>{display}</div>
                        {previous && operation && (
                            <div className='text-sm text-muted-foreground'>
                                {previous} {operation}
                            </div>
                        )}
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                        {buttons.flat().map((btn) => (
                            <Button
                                key={btn}
                                variant={['÷', '×', '-', '+', '='].includes(btn) ? 'default' : 'outline'}
                                className='h-14 text-lg font-semibold'
                                onClick={() => {
                                    if (btn === 'C') handleClear()
                                    else if (btn === '=') handleEquals()
                                    else if (['÷', '×', '-', '+'].includes(btn)) handleOperation(btn)
                                    else handleNumber(btn)
                                }}
                            >
                                {btn}
                            </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
