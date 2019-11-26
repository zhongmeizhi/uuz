import React from 'react';

interface MaskProps {
    modalHandler?: Function
    quitting?: boolean
}

class Mask extends React.PureComponent<MaskProps> {

    modalHandler = () => {
        if (typeof this.props.modalHandler === 'function') {
            this.props.modalHandler()
        }
    }

    render() {
        const className = `zui-mask ${this.props.quitting ? 'zui-mask-quit' : ''}`
        return (
            <div
                className={className}
                onClick={this.modalHandler}>
            </div>
        )
    }
}

export default Mask;