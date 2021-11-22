const logging = false;

export function consoleLog(
  component: any,
  text: string,
  level: number = 1
): void {
  const dateTime = new Date();
  if (logging) {
    console.log(
      dateTime.toLocaleTimeString() +
        ' - ' +
        new Array(level).join('  ') +
        `${text} (${component.constructor.name})`
    );
  }
}
