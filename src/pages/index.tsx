import ChatLayout from "src/components/Layout/ChatLayout";

function Home() {
    return (
        <>
            Welcome to page!
        </>
    )
}

Home.getLayout = (page: any) => <ChatLayout>
    {page}
</ChatLayout>;

export default Home;


