import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from "@fortawesome/free-brands-svg-icons"

import YouthLogo from './assets/youthsjrm.svg'

const Header = () => {
    return (
        <header>
            <span className="header-content header-page-info">
                <img className="header-icon" src={YouthLogo}/>                
                <span className="header-title">The Youth Chordbookerizer</span>
            </span>
            <a className="header-content header-gh" 
                href="https://github.com/notgian/youth-chordbookerizer" 
                target="_blank"
            >
                <span className="header-gh-text">notgian/youth-chordbookerizer</span>
                <FontAwesomeIcon className="header-gh-icon" icon={faGithub} />
            </a>
        </header>
    )
}

export default Header
