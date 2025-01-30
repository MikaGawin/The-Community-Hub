import UserCreateForm from "./UserDetails/userCreateForm";

function Home({ isLoggedIn }) {
  return (
    <>
      <div>the user is logged in: {isLoggedIn.toString()}</div>
      <div>
        <UserCreateForm />
      </div>
    </>
  );
}

export default Home;
