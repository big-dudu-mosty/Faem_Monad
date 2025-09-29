import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { WalletConnection } from '@/components/web3/WalletConnection'
import { formatAddress } from '@/utils/format'
import {
  ChartBarIcon,
  TrophyIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import {
  useRealGlobalStats,
  usePaginatedLeaderboard
} from '@/hooks/contracts'

type StatTab = 'overview' | 'activity' | 'rankings' | 'community'

export function StatsPage() {
  const [activeTab, setActiveTab] = useState<StatTab>('overview')
  const { isConnected } = useAccount()

  // 获取统计数据
  const {
    globalStats,
    totalPlayersCount,
    isLoading: statsLoading,
    hasError: statsError,
    lastRefresh,
    refetch,
    gameActivity
  } = useRealGlobalStats()

  // 获取排行榜数据
  const {
    harvestLeaderboard,
    kindnessLeaderboard,
    isLoading: leaderboardLoading
  } = usePaginatedLeaderboard()

  // 获取排行榜统计 - 从分页排行榜Hook中获取
  const leaderboardStats = usePaginatedLeaderboard().stats

  const isLoading = statsLoading || leaderboardLoading

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <ChartBarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            数据统计
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            连接您的钱包查看农场游戏的全面数据统计和社区分析。
          </p>
          <WalletConnection />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">游戏数据统计</h1>
        <p className="text-gray-600">
          深入了解农场社区的全面数据分析
        </p>
      </div>

      {/* 标签导航 */}
      <Card>
        <CardContent>
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap">
              {[
                { key: 'overview', label: '总览', icon: ChartBarIcon },
                { key: 'activity', label: '活跃度', icon: ArrowTrendingUpIcon },
                { key: 'rankings', label: '排名分析', icon: TrophyIcon },
                { key: 'community', label: '社区健康', icon: HeartIcon }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab(tab.key as StatTab)}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 刷新按钮 */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={refetch}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors text-sm"
        >
          {isLoading ? '刷新中...' : '🔄 刷新数据'}
        </button>
      </div>

      {/* 内容区域 */}
      {isLoading ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">加载统计数据中...</p>
            </div>
          </CardContent>
        </Card>
      ) : statsError ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-2">
                加载统计数据失败
              </div>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                重试
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 总览标签 */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalPlayersCount}
                  </div>
                  <div className="text-sm text-gray-600">总玩家数</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">🌾</div>
                  <div className="text-2xl font-bold text-green-600">
                    {globalStats.totalHarvests}
                  </div>
                  <div className="text-sm text-gray-600">总收获次数</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {globalStats.totalHelps}
                  </div>
                  <div className="text-sm text-gray-600">互助次数</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {globalStats.totalEvents}
                  </div>
                  <div className="text-sm text-gray-600">总事件数</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">🥷</div>
                  <div className="text-2xl font-bold text-red-600">
                    {globalStats.totalSteals}
                  </div>
                  <div className="text-sm text-gray-600">偷菜次数</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {globalStats.averageHarvestPerPlayer}
                  </div>
                  <div className="text-sm text-gray-600">平均收获数</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">💝</div>
                  <div className="text-2xl font-bold text-pink-600">
                    {globalStats.helpRate}%
                  </div>
                  <div className="text-sm text-gray-600">互助率</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent>
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : '--:--:--'}
                  </div>
                  <div className="text-sm text-gray-600">最后更新</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 活跃度标签 */}
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ArrowTrendingUpIcon className="w-5 h-5" />
                    <span>游戏活跃度分析</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">活跃度等级</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        gameActivity.activityLevel === 'high'
                          ? 'bg-green-100 text-green-700'
                          : gameActivity.activityLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {gameActivity.activityLevel === 'high' ? '高活跃' :
                         gameActivity.activityLevel === 'medium' ? '中活跃' : '低活跃'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">增长率</span>
                      <span className="font-semibold text-green-600">
                        {gameActivity.growthRate}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">社区健康度</span>
                      <span className="font-semibold text-purple-600">
                        {gameActivity.communityHealth}%
                      </span>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• 人均事件: {globalStats.averageHarvestPerPlayer} 次</p>
                        <p>• 人均互助: {globalStats.averageHelpPerPlayer} 次</p>
                        <p>• 偷菜率: {globalStats.stealRate}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CubeIcon className="w-5 h-5" />
                    <span>行为分析</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: '收获行为', value: globalStats.totalHarvests, color: 'bg-green-500' },
                      { name: '互助行为', value: globalStats.totalHelps, color: 'bg-purple-500' },
                      { name: '偷菜行为', value: globalStats.totalSteals, color: 'bg-red-500' }
                    ].map((item) => {
                      const total = globalStats.totalHarvests + globalStats.totalHelps + globalStats.totalSteals
                      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0

                      return (
                        <div key={item.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">{item.name}</span>
                            <span className="text-sm font-medium">{item.value} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 排名分析标签 */}
          {activeTab === 'rankings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5" />
                    <span>收获排行榜 TOP 5</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {harvestLeaderboard && harvestLeaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {harvestLeaderboard.slice(0, 5).map((player, index) => (
                        <div key={player.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-amber-600 text-white' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{formatAddress(player.address)}</div>
                              <div className="text-sm text-gray-600">收获 {player.harvestCount} 次</div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>偷菜: {player.stealCount}</div>
                            <div>互助: {player.helpCount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      暂无排行榜数据
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HeartIcon className="w-5 h-5" />
                    <span>善良值排行榜 TOP 5</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kindnessLeaderboard && kindnessLeaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {kindnessLeaderboard.slice(0, 5).map((player, index) => (
                        <div key={player.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-purple-500 text-white' :
                              index === 1 ? 'bg-pink-400 text-white' :
                              index === 2 ? 'bg-indigo-600 text-white' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{formatAddress(player.address)}</div>
                              <div className="text-sm text-gray-600">KIND {player.displayKindBalance}</div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>互助: {player.helpCount}</div>
                            <div>收获: {player.harvestCount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      暂无排行榜数据
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 社区健康标签 */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent>
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {gameActivity.communityHealth}%
                    </div>
                    <div className="text-sm text-gray-600">社区健康指数</div>
                    <div className="mt-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        gameActivity.communityHealth >= 70 ? 'bg-green-100 text-green-700' :
                        gameActivity.communityHealth >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {gameActivity.communityHealth >= 70 ? '健康' :
                         gameActivity.communityHealth >= 40 ? '一般' : '需改善'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent>
                    <div className="text-3xl mb-2">💝</div>
                    <div className="text-2xl font-bold text-pink-600">
                      {globalStats.helpRate}%
                    </div>
                    <div className="text-sm text-gray-600">互助参与率</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({globalStats.totalHelps} 次互助)
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent>
                    <div className="text-3xl mb-2">⚖️</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {globalStats.stealRate}%
                    </div>
                    <div className="text-sm text-gray-600">偷菜发生率</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({globalStats.totalSteals} 次偷菜)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {leaderboardStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>社区贡献者</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">🌾 收获冠军</h4>
                        {leaderboardStats.topHarvester ? (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="font-medium">
                              {formatAddress(leaderboardStats.topHarvester.address)}
                            </div>
                            <div className="text-sm text-gray-600">
                              收获 {leaderboardStats.topHarvester.harvestCount} 次
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">暂无数据</div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">💝 善良使者</h4>
                        {leaderboardStats.topHelper ? (
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="font-medium">
                              {formatAddress(leaderboardStats.topHelper.address)}
                            </div>
                            <div className="text-sm text-gray-600">
                              互助 {leaderboardStats.topHelper.helpCount} 次
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">暂无数据</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}