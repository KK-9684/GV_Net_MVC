import { CHART_SETTINGS } from './_components/config/grid-settings-config';

export function generateMomentumGraphConfig(strategy) {
  let momentumGraphConfig = CHART_SETTINGS;

  if (strategy && strategy.momentumGraphConfig) {
    const matchingKeys = [
      { local: 'homeColor', remote: 'Home' },
      { local: 'awayColor', remote: 'Away' },
      { local: 'chartBackground', remote: 'Background' },
      { local: 'offTarget', remote: 'ShotsOffTarget' },
      { local: 'onTarget', remote: 'ShotsOnTarget' },
      { local: 'onTarget', remote: 'ShotsOnTarget' },
      { local: 'redCard', remote: 'RedCard' },
      { local: 'yellowCard', remote: 'YellowCard' },
      { local: 'corner', remote: 'Corner' },
      { local: 'goal', remote: 'Goal' },
    ];
    const remoteConfig = JSON.parse(strategy.momentumGraphConfig);

    matchingKeys.forEach((key) => {
      if (remoteConfig[key.remote].length !== 0) {
        momentumGraphConfig[key.local] = remoteConfig[key.remote];
      }
    });
  }

  return momentumGraphConfig;
}
