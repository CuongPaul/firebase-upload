import axios from "axios";
import { useEffect, useState } from "react";

import "./App.css";

function App() {
    const [pic, setPic] = useState();
    const [allPics, setAllPics] = useState([]);

    const getAllPics = () =>
        axios
            .get("http://localhost:4000/get-images")
            .then((res) => setAllPics(res.data.data))
            .catch((error) => console.log(error.message));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("pic", pic);

        await axios
            .post("http://localhost:4000/upload-image", formData)
            .then(() => getAllPics())
            .catch((error) => console.log(error.message));
    };

    const handleDelete = async (name) => {
        await axios
            .delete("http://localhost:4000/remove-image", {
                data: { name: name },
            })
            .then(() => getAllPics())
            .catch((error) => console.log(error.message));
    };

    useEffect(() => {
        getAllPics();
    }, []);

    return (
        <div className="app">
            <form
                className="form"
                onSubmit={handleSubmit}
                style={{ justifyContent: "center" }}
            >
                <input
                    type="file"
                    onChange={(e) => setPic(e.target.files[0])}
                />
                <button style={{ cursor: "pointer" }}>Upload</button>
            </form>
            <div className="image-container">
                {allPics.map((pic) => (
                    <div className="image-item" key={pic.name}>
                        <img className="img" src={pic.url} alt="" />
                        <button
                            style={{ cursor: "pointer" }}
                            className="imgButton"
                            onClick={() => handleDelete(pic.name)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
