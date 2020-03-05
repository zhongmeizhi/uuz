import React, { useState, useRef, useEffect } from 'react'
import { ReactComponent as NoticeSvg } from '../static/notice.svg'
import { getClassName } from '../utils/base';

interface NoticeProps {
	className?: string,
	text: string,
	isScroll: boolean,
	speed: number,
	suffix?: React.ReactNode
}

export default function Notice({ className = '', text, isScroll = true, speed = 18, suffix }: NoticeProps) {

	const [translateX, setTranslateX] = useState(0);
	const [scrollStore, setScrollStore] = useState({width: 0, isCopy: false});
	const refNotice = useRef(null);
	const refItem = useRef(null);

	let intervalHandler: NodeJS.Timeout;
	const gapWidth = 66;

	const noticeClassNames = {
        [className]: !!className,
        [`zui-notice-quiet`]: !isScroll
    }

	function run() {
		if (scrollStore.width <= -translateX) {
			setTranslateX(0);
		} else {
			setTranslateX(translateX - 1);
		}
	}
	
	useEffect(() => {
		if (scrollStore.isCopy) {
			intervalHandler = setTimeout(run, speed);
		}
	}, [translateX])

	useEffect(() => {
		if (isScroll) {
			const itemWidth = (refItem.current as any).offsetWidth;
			const NoticeWidth = (refNotice.current as any).offsetWidth;
			setScrollStore({
				width: itemWidth + gapWidth,
				isCopy: itemWidth > NoticeWidth
			});
			setTranslateX(1);
		}
		return () => {
			intervalHandler && clearTimeout(intervalHandler)
		};
	}, [])

	return <div className={"zui-notice".concat(getClassName(noticeClassNames))}>
		<NoticeSvg
			className="zui-notice-icon"
			width="15px"
			height="36px"
			fill="red"
		></NoticeSvg>
		<div className="zui-notice-box" ref={refNotice}>
			<div style={{ transform: `translateX(${translateX}px)` }}>
				<div
					ref={refItem}
					className="zui-notice-item"
				>{text}</div>
				{
					scrollStore.isCopy ? <>
						<div className="zui-notice-item" style={{width: `${gapWidth}px`}}></div>
						<div className="zui-notice-item">{text}</div>
					</> : null
				}
			</div>
		</div>
		{suffix}
	</div>
}
