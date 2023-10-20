import React from 'react';

import {
    Nav,
    Button,
} from 'react-bootstrap';

import '../contextMenu.css';

class ContextMenu extends React.Component {
    state = {
        visible: false,
    };

    componentDidMount() {
        document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
      document.removeEventListener('contextmenu', this._handleContextMenu);
      document.removeEventListener('click', this._handleClick);
      document.removeEventListener('scroll', this._handleScroll);
    }
    
    _handleContextMenu = (event) => {
        if (
                event.target.tagName === 'TD' &&
                window.getSelection().isCollapsed
            ) {
                event.preventDefault();

                this.setState({ visible: true });
                
                const clickX = event.clientX;
                const clickY = event.clientY;
                const screenW = window.innerWidth;
                const screenH = window.innerHeight;
                const rootW = this.root.offsetWidth;
                const rootH = this.root.offsetHeight;

                // console.log(clickX)
                // console.log(rootW)
                // console.log(rootH)

                const right = (screenW - clickX) > rootW;
                const left = !right;
                const top = (screenH - clickY) > rootH;
                const bottom = !top;
                
                if (right) {
                    this.root.style.left = `${clickX + 5}px`;
                }
                
                if (left) {
                    this.root.style.left = `${clickX - rootW - 5}px`;
                }
                
                if (top) {
                    this.root.style.top = `${clickY + 5}px`;
                }
                
                if (bottom) {
                    this.root.style.top = `${clickY - rootH - 5}px`;
                }
            }
    };

    _handleClick = (event) => {
        const { visible } = this.state;
        const wasOutside = !(event.target.contains === this.root);
        
        if (wasOutside && visible) this.setState({ visible: false, });
    };

    _handleScroll = () => {
        const { visible } = this.state;
        
        if (visible) this.setState({ visible: false, });
    };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
    // HandleRefreshClick = (e, { name }) => {
        // this.setState({activeItem: name})
        // window.location.reload()
    // }
    
    render() {
        const { visible } = this.state;
        const { activeItem } = this.state
        
        return(visible || null) && 
            <div ref={ref => {this.root = ref}} className="contextMenu">
                <Nav className='flex-column'>
                    <Nav.Link className="link-context">
                        {/* <Button className='btn-context'> */}
                            Detalii
                        {/* </Button>  */}
                    </Nav.Link>
                    <Nav.Link className="link-context">
                        {/* <Button className='btn-context'> */}
                            In executare
                        {/* </Button> */}
                    </Nav.Link>
                    <Nav.Link className='link-context'>
                        {/* <Button className='btn-context'> */}
                            Executat
                        {/* </Button> */}
                    </Nav.Link>
                    <Nav.Link className="link-context">
                        {/* <Button className='btn-context'> */}
                            Neexecutat
                        {/* </Button> */}
                    </Nav.Link>
                </Nav>
            </div>
    };
}
export default ContextMenu;