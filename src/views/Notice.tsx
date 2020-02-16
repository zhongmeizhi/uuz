import React from 'react'

import { ReactComponent as NoticeSvg } from '../static/notice.svg'

interface NoticeProps {
    text: string
}

export default function Notice({text} : NoticeProps) {
    return <div className="zui-notice">
        <div className="zui-notice-icon">
            <NoticeSvg
                width="15px"
                height="auto"
                fill="red"
            ></NoticeSvg>
        </div>
        <div className="zui-notice-box">
            <div className="zui-notice-item">
                {text}
            </div>
        </div>
    </div>
}
