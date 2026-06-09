import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export type ChartDatum = { label: string; count: number; color: string }

type IndicatorCardProps = {
  title: string
  description: string
  data: ChartDatum[]
  /** Tabela acessível equivalente ao gráfico (drill-down quando aplicável). */
  table: React.ReactNode
}

/**
 * Indicador = gráfico (apoio visual) + tabela equivalente (navegável por
 * teclado, com drill-down). Nada depende só de cor: a tabela traz os números.
 */
export function IndicatorCard({
  title,
  description,
  data,
  table,
}: IndicatorCardProps) {
  const chartHeight = Math.max(140, data.length * 40)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <ResponsiveContainer width='100%' height={chartHeight}>
          <BarChart
            data={data}
            layout='vertical'
            margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
          >
            <XAxis type='number' hide allowDecimals={false} />
            <YAxis
              type='category'
              dataKey='label'
              width={150}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke='currentColor'
              className='text-muted-foreground'
            />
            <Bar dataKey='count' radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {table}
      </CardContent>
    </Card>
  )
}
