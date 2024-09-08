const getUrlPlayers = () => new URLSearchParams(window.location.search).get('players')?.split(',')

export default getUrlPlayers
