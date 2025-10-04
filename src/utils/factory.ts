export function formatMembers(count: number){
    return `${count >= 1000? String(count)[0] + "k" : String(count)} member${count > 1? 's': ''}`
}


export function formatDateString(dateStr: string){
    const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return formattedDate
}