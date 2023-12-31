import React, { useState, useEffect } from 'react';
import { Loader, Card, FormField } from '../components/index';
import { logo } from '../assets';
import axios from 'axios';

//Componente que renderice todas las Cards
const RenderCards = ({ data, title }) => {
    if (data.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />);
    }

    return <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>;
};

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchedResults] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);

    //Desplegar todos los posts:

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/v1/post');

            if (response.status == 200) {
                const result = response.data.data
                setAllPosts(result.reverse());
                console.log(result);
            };

        } catch (err) {
            alert(err);
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    //Funcion para la busqueda de Posts
    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        setSearchTimeout(
            setTimeout(() => {
                const searchResult = allPosts.filter(
                    (item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())
                );
                setSearchedResults(searchResult);
            }, 500)
        );
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Nebulabs AI Image Generator</h1>
                <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
                    Browse through a collection of imaginative and visually stunning images powered by
                    <span className="inline-flex items-center">
                        <img src={logo} alt="logo" className="w-16 object-contain ml-2 mt-2" />
                    </span>
                  
                </p>
            </div>

            <div className="mt-16">
                <FormField labelName="Search posts" type="text" name="text" placeholder="Search posts" value={searchText} handleChange={handleSearchChange} />
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className="font-medium text-[#666e75] text-xl mb-3">
                                Showing results for <span className="text-[#222328]">{searchText}</span>
                            </h2>
                        )}
                        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                <RenderCards data={searchedResults} title="No search results found" />
                            ) : (
                                <RenderCards data={allPosts} title="No posts found" />
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Home;
