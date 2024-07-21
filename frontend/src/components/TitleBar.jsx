import { useState, useEffect } from 'react'
import { useAppContext } from "../contexts/AppContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

function TitleBar() {
    const [newTag, setNewTag] = useState("")
    const [selectedTags, setSelectedTags] = useState([])
    const { titles, tags, setTags, setBlog, setJsx, setHtml } = useAppContext()
    const [selectedTitle, setSelectedTitle] = useState(null)
    const [titleText, setTitleText] = useState("")
    const [prompt, setPrompt] = useState("")
    const [generatedTitles, setGeneratedTitles] = useState([])

    const SelectTitle = (title) => {
        setTitleText(title)
        setSelectedTitle(title === selectedTitle ? null : title)
    }

    const handleAddTags = () => {
        if (newTag.trim() !== "") {
            const trimmedTag = newTag.trim()
            setTags((prevTags) => [...prevTags, trimmedTag])
            setSelectedTags((prevSelected) => [...prevSelected, trimmedTag])
            setNewTag("")
        }
    }

    const CloseTitleWindow_mark = () => {
        setSelectedTitle(null)
        setGeneratedTitles((prevGeneratedTitles) => [...prevGeneratedTitles, selectedTitle])
    }

    const CloseTitleWindow = () => {
        setSelectedTitle(null)
    }

    const GenerateBlog = async (event) => {
        const body = {
            title: titleText,
            tags: selectedTags,
            custom_prompt: prompt
        }
        event.preventDefault()
        try {
            const response = await fetch('https://nervous-zebra-54.telebit.io/api/generateblog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const Response = await response.json()
                setBlog(Response.blog)
                setHtml(null)
                setJsx(null)
                console.log(Response.blog)
                CloseTitleWindow_mark()
            } else {
                const errorResponse = await response.json()
                console.error(errorResponse)
                alert('Failed to get response')
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed due to Bad Connection. Try Again')
        }
    }

    const toggleTagSelection = (tag) => {
        setSelectedTags((prevSelected) => {
            if (prevSelected.includes(tag)) {
                return prevSelected.filter(k => k !== tag)
            } else {
                return [...prevSelected, tag]
            }
        })
    }

    const handleChange = (e) => {
        const newText = e.target.value
        setTitleText(newText)
    }

    return (
        <div className="w-2/5 h-full py-8 px-8 overflow-y-auto">
            <h2 className="py-1 font-poppins font-semibold text-lg tracking-wide">Suggested Titles</h2>
            {titles && titles.length > 0 ? (
                titles.map((title, index) => (
                    <div key={index} className="h-auto w-full flex flex-col">
                        <div className="h-full flex flex-col justify-between items-center">
                            <button
                                onClick={() => SelectTitle(title)}
                                className={`relative mt-2 px-4 py-1 text-custom-black rounded-xl border-2 border-gray-500 transition-colors ${generatedTitles.includes(title) ? 'bg-custom-gray text-white' : 'hover:bg-custom-gray hover:text-white'}`}
                            >
                                {title}
                                {generatedTitles.includes(title) ? <p className='absolute bottom-1 right-2 text-lg'><FontAwesomeIcon icon={faCheck} /></p> : <li className="bx bx-pencil absolute bottom-2 right-2 text-lg"></li>}
                            </button>
                            {selectedTitle === title && (
                                <div className="relative mt-4 p-4 border-2 rounded-lg bg-white border-gray-500">
                                    <button onClick={CloseTitleWindow} className='absolute top-1 right-2'>✗</button>
                                    <p className='font-poppins text-[12px]'>Title </p>
                                    <textarea
                                        value={titleText}
                                        onChange={handleChange}
                                        className="whitespace-pre-wrap font-poppins text-[12px] w-full h-full max-h-24 border border-gray-300 rounded-lg p-2 resize-none focus:outline-none scroll-container"
                                    />
                                    <div className="mb-2">
                                        <p className='font-poppins text-[12px]'>Related Tags:</p>
                                        <div className="flex flex-wrap gap-1 mt-2 max-h-20 overflow-y-auto scroll-container">
                                            {Array.isArray(tags) && tags.length > 0 ? (
                                                tags.map((tag, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => toggleTagSelection(tag)}
                                                        className={`text-black text-[12px] font-poppins px-4 py-1 rounded-xl border-2 transition duration-200 ${selectedTags.includes(tag)
                                                            ? 'border-custom-black bg-custom-gray text-white'
                                                            : 'hover:bg-custom-white hover:text-custom-gray border-gray-300'
                                                            }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No tags available</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="my-4 relative flex items-center">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            className="border border-gray-300 rounded-2xl px-4 py-1 pr-10 w-full placeholder-gray-500 focus:outline-none"
                                            placeholder="Add a new keyword"
                                        />
                                        <button
                                            onClick={handleAddTags}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 text-black rounded-full hover:bg-gray-200 transition duration-200"
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    </div>
                                    <textarea
                                        type="text"
                                        id="prompt"
                                        name="prompt"
                                        value={prompt}
                                        rows="4"
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Type your custom prompt here..."
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                    <p className='p-2 font-poppins text-[12px]'>Model</p>
                                    <div className=' w-full space-x-2 flex'>
                                        <button className=' w-1/2 px-2 py-1 rounded-xl font-poppins text-custom-black text-sm border hover:bg-custom-white hover:text-custom-gray border-gray-300'>Llama 3 8B</button>
                                        <button onClick={GenerateBlog} className=' w-1/2 px-2 py-1 rounded-xl font-poppins text-custom-white bg-custom-black text-sm hover:bg-slate-700 hover:text-custom-white border-gray-300'>Generate</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <h1 className="py-1 font-poppins font-thin text-sm tracking-wide">No titles yet</h1>
            )}
        </div>
    )
}

export default TitleBar