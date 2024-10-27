import styled from "styled-components"

const StyledHeader = styled.header`
    /* background-color: blue; */
    background-color: lightblue;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10vh;
    border-bottom: 1px solid black;
    font-size: 40px;
    font-weight: 700;
`;

function Header() {
    return (
        <StyledHeader>
            QRCode Generator
        </StyledHeader>
    )
}

export default Header;
