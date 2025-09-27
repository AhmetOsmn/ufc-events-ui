import type { Fight } from "../types";

interface FightCardProps {
  fights: Fight[];
}

function FightCard({ fights }: FightCardProps) {
  const getOrderText = (order: number) => {
    switch (order) {
      case 1:
        return "Ana Maç";
      case 2:
        return "Ortak Ana Maç";
      case 3:
        return "Öne Çıkan Maç";
      case 4:
        return "Ön Eleme";
      case 5:
        return "Açılış Maçı";
      default:
        return `${order}. Maç`;
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        Dövüş Kartı
      </h3>

      {/* Mobil/Tablet Görünüm - Kartlar */}
      <div className="block xl:hidden space-y-4 sm:max-h-96 sm:overflow-y-auto">
        {fights.map((fight, index) => (
          <div
            key={`${fight.weightClass}-${index}`}
            className="bg-slate-200/20 dark:bg-slate-800/20 rounded-lg border border-primary/20 dark:border-primary/30 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                {fight.weightClass}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {getOrderText(fight.order)}
              </span>
            </div>

            <div className="space-y-3">
              {fight.fighters.map((fighter, fighterIndex) => (
                <div
                  key={fighterIndex}
                  className="flex items-center justify-between bg-white dark:bg-slate-700 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {fighter.name}
                      </span>
                      {fighter.ranking && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit">
                          #{fighter.ranking}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>Rekor: {fighter.record}</span>
                      <span>Ülke: {fighter.country}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Masaüstü Görünüm - Tablo (sadece çok geniş ekranlarda) */}
      <div className="hidden xl:block overflow-hidden rounded-lg border border-primary/20 dark:border-primary/30">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-200/50 text-sm font-medium text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              <tr>
                <th className="px-4 lg:px-6 py-3">Sıklet Kategorisi</th>
                <th className="px-4 lg:px-6 py-3">Sıra</th>
                <th className="px-4 lg:px-6 py-3">Dövüşçüler</th>
                <th className="px-4 lg:px-6 py-3">Rekor</th>
                <th className="px-4 lg:px-6 py-3">Ülke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/20 text-sm text-slate-600 dark:divide-primary/30 dark:text-slate-400">
              {fights.map((fight, index) => (
                <tr key={`${fight.weightClass}-${index}`}>
                  <td className="px-4 lg:px-6 py-4 font-medium">
                    {fight.weightClass}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    {getOrderText(fight.order)}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="space-y-1">
                      {fight.fighters.map((fighter, fighterIndex) => (
                        <div
                          key={fighterIndex}
                          className="font-medium text-slate-800 dark:text-slate-200"
                        >
                          {fighter.name}
                          {fighter.ranking && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              #{fighter.ranking}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="space-y-1">
                      {fight.fighters.map((fighter, fighterIndex) => (
                        <div key={fighterIndex} className="text-xs">
                          {fighter.record}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="space-y-1">
                      {fight.fighters.map((fighter, fighterIndex) => (
                        <div key={fighterIndex} className="text-xs">
                          {fighter.country}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FightCard;
