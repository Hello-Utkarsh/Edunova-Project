import { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner'


export default function Transaction() {
    const [books, setBooks] = useState<{ book: string, id: string }[] | null>(null)

    useEffect(() => {
        issuedBook()
    }, [])

    const issuedBook = async () => {
        const authToken = localStorage.getItem('token')
        if (!authToken) {
            console.log("Please Login/SignUp")
            return
        }
        const req = await fetch(`${import.meta.env.VITE_PORT}/transaction/issuedbookbypeopl`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        })
        const res: { message: string, books: { book: string, id: string }[] } = await req.json()
        if (res.message == 'success') {
            setBooks(res.books)
            return
        }
        console.log(res.message)
    }

    const returnBook = async (id: string) => {
        const authToken = localStorage.getItem('token')
        if (!authToken) {
            console.log("Please Login/SignUp")
            return
        }
        const req = await fetch(`${import.meta.env.VITE_PORT}/transaction/return`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'id': id
            }
        })
        const res = await req.json()
        if (res.message == 'success') {
            toast(`total rent is ${res.totalRent}`)
        }
    }
    return (
        <div className='px-4 py-4'>
            <h1 className='text-2xl font-semibold'>Books Issued</h1>
            {books && books.map(val => {
                return (
                    <Card key={val.id} className='w-fit'>
                        <CardHeader>
                            <CardTitle>{val.book}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => { returnBook(val.id) }} className='mt-2'>Return</Button>
                        </CardContent>
                    </Card>
                )
            })}
            <Toaster />
        </div>
    )
}
