import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner'



export default function dashboard() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [books, setBooks] = useState<{ category: string, name: string, rent: number, id: string }[] | null>(null)

    useEffect(() => {
        fetch_books()
    }, [])

    const fetch_books = async () => {
        const req = await fetch("http://localhost:3000/book/getallbook", {
            method: "GET"
        })
        const res: { message: string, books: { category: string, name: string, rent: number, id: string }[] } = await req.json()
        console.log(res.books)
        setBooks(res.books)
    }

    const handleSearch = async () => {
        const req = await fetch("http://localhost:3000/book/getBook", {
            method: 'GET',
            headers: {
                'Content-Type': 'applictaion/json',
                "name": search,
                "gt": minPrice,
                "lt": maxPrice,
                "category": category
            }
        })
        const res = await req.json()
        setBooks(res)
    }

    const issueBook = async (book: string) => {
        const authToken = localStorage.getItem('token')
        if (!authToken) {
            console.log("Please Login/SignUp")
            return
        }
        const req = await fetch("http://localhost:3000/transaction/issue", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({
                book: book
            })
        })
        const res: { message: string } = await req.json()
        toast(res.message)
    }

    return (
        <div className='py-4 px-4'>
            <div className='flex flex-col'>
                <div className='flex'>
                    <Input className='mx-2' onChange={(e) => setSearch(e.target.value)} placeholder='Search...' />
                    <Button onClick={handleSearch} className='mx-2'>Search</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='px-2 py-1 text-white rounded-lg bg-black mx-2'>Filters</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className='flex my-2'>
                                <Input className='mx-2' onChange={(e) => setMinPrice(e.target.value)} placeholder='Min Price' />
                                <Input className='mx-2' onChange={(e) => setMaxPrice(e.target.value)} placeholder='Max Price' />
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='px-2 py-1 text-white rounded-lg bg-black mx-2'>Category</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setCategory("")}>None</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Fiction")}>Fiction</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Dystopian")}>Dystopian</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Romance")}>Romance</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Adventure")}>Adventure</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Fantasy")}>Fantasy</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Historical")}>Historical</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Psychological")}>Psychological</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCategory("Classical")}>Classical</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
            <div className='mt-4 flex-col mx-2'>
                <h1 className='text-2xl font-semibold'>All Books</h1>
                <div className='grid grid-cols-6 gap-y-4 gap-4 mt-2'>
                    {books && books.map(val => {
                        return (
                            <Card key={val.id} id={val.id} className=''>
                                <CardHeader>
                                    <CardTitle>{val.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Rent: {val.rent}</p>
                                    <p>Category: {val.category}</p>
                                    <Button onClick={() => { issueBook(val.name) }} className='mt-2'>Issue</Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <Toaster />
        </div>
    )
}
