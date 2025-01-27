import UserForm from "./userDetails/userForm"

function Home({ isLoggedIn }) {
    return (
        <>
            <header> the user is logged in: {isLoggedIn.toString()}</header>
            <div>
                <UserForm />
            </div>
        </>
    );
}

export default Home;