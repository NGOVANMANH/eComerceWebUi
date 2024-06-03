import Image from "./Image";
import userDefaultImage from "../assets/user_default.jpg"

const UserInfor = (props) => {
    return (
        <>
            <div className={"d-flex flex-row mb-2"}>
                <Image src={props.image ? props.image : userDefaultImage} alt="User avt" type={props.onlyAvatar ? "nav bar item" : "avatar"} />
                {
                    !props.onlyAvatar &&
                    <div className="ms-2 d-flex flex-column justify-content-center">
                        <div className="fs-5">{props.fullName ? props.fullName : "First name + last name"}</div>
                        <div className="fs-6">{props.email ? props.email.toLowerCase() : "user@example.com"}</div>
                    </div>
                }
            </div>
        </>
    );
}

export default UserInfor;
