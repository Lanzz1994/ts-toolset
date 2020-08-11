
/** 匹配返回两个字符串的交集，xbc abcd => bc */
export function getOverlap(source: string, target: string) {

    if (!source || !target) return '';

    let index = source.length;
    while (index) {
        let temp = source.slice(0, index--);
        if (temp && target.indexOf(temp) > -1) return temp;
    }
}

export function isFalseOrWhitespace(str: string | null | undefined): boolean {
    if (!str || typeof str !== 'string') {
        return true;
    }
    return str.trim().length === 0;
}

export function escapeHtml(html: string): string {
    const matchObj: any = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
    return html.replace(/[<>&]/g, match => matchObj[match] || match);
}
