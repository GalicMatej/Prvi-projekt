import styled from "styled-components"
import Header from "./Header";
// import MainPage from "../pages/MainPage";
import { Outlet } from "react-router-dom";

const StyledAppLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const Main = styled.main`
    background-color: var(--color-grey-50);
    padding-top: 100px;
    padding-left: 150px;
    padding-right: 150px;
    /* overflow-y: auto; */
`;

function AppLayout() {
    return (
        <StyledAppLayout>
            <Header />
            <Main>
                <Outlet />
            </Main>
        </StyledAppLayout>
    )
}

export default AppLayout;
