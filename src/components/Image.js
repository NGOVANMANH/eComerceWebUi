import styled from "styled-components";

const Image = (props) => {
    let Component = Default;
    if (props.type === 'avatar') {
        Component = Avartar;
    }
    else if (props.type === 'brand avatar') {
        Component = BrandAvatar;
    }
    else if (props.type === 'nav bar item') {
        Component = NavBarItem;
    }
    else if (props.type === 'product') {
        Component = Product;
    }
    return (
        <Component src={props.src} alt={props.alt} />
    );
}

const Default = styled.img`
    display: block;
`

const Avartar = styled.img`
    display: block;
    object-fit: cover;
    width: 100px;
    height: 100px;
    border: 1px solid black;
    border-radius: 100%;
`

const Product = styled.img`
    display: block;
    object-fit: cover;
    width: 150px;
    height: 200px;
    border: 1px solid black;
`

const BrandAvatar = styled.img`
    display: block;
    object-fit: cover;
    width: 60px;
    height: 60px;
`

const NavBarItem = styled.img`
    display: block;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
`

export default Image;
