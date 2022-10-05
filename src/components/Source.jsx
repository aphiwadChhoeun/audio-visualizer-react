const Source = ({fileHandler}) => {

    return (
        <div className="source-container">
            <input type="file" onChange={(e) => fileHandler(e.target.files[0])} />
        </div>
    )
}

export default Source