import React, { Component } from 'react';

class WinModal extends Component {
    render() {
        let className
        if (this.props.isModalOn) {
            className = 'modal fade-in'
        } else {
            className = 'modal'
        }
        const { arrowIcon } = this.props
        const arrowIconStyle = {
            backgroundImage: `url(${arrowIcon})`,
            backgroundSize: 'contain',
            height: 24,
            width: 24,
            cursor: 'pointer'
        }
        return (
            <div onClick={this.props.handleHideModal} id="modal" className={className}>
                <div className="modal__content">
                    <h3>YOU WIN</h3>
                    <p>You won in <span id="time-result">{this.props.timeResultText}</span> with <span id="star-result">{this.props.starResultText}</span> stars</p>
                    <button id="play-again" onClick={
                        e => {
                            this.props.handleHideModal(e)
                            setTimeout(this.props.reset, 500)
                        }
                    }>
                        PLAY AGAIN
                        <div style={arrowIconStyle}></div>
                    </button>
                </div>
            </div>
        );
    }
}

export default WinModal;