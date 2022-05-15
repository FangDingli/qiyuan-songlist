export const getRandomNum = (min: number, max: number): number => {
  const range = max - min
  const rand = Math.random()
  const number = min + Math.round(rand * range)

  return number
}

export const shuffle = (arr: []): [] => {
  let currIndex = arr.length
  let randomIndex = 0
  while (currIndex != 0) {
    randomIndex = Math.floor(Math.random() * currIndex)
    currIndex--;

    [arr[currIndex], arr[randomIndex]] = [arr[randomIndex], arr[currIndex]]
  }

  return arr
}