function Home({ isLoggedIn }) {
    console.log(isLoggedIn);
    return (
        <>
            <header> the user is logged in: {isLoggedIn.toString()}</header>
        </>
    );
}

export default Home;