import javascript_time_ago from '../source/JavascriptTimeAgo'
import { twitterStyle, timeStyle } from '../source/style'
import { day, month, year } from '../source/gradation'

// Load locale specific relative date/time messages
import english from '../locale/en'

describe(`time ago`, function()
{
	it(`should try various flavours if some are not found`, function()
	{
		const time_ago = new javascript_time_ago('en')
		time_ago.format(Date.now(), { flavour: ['exotic', 'short'] }).should.equal('now')
	})

	it(`should fallback from "tiny" to "narrow" for Twitter style for autogenerated locales`, function()
	{
		const time_ago = new javascript_time_ago('de')
		time_ago.format(Date.now() - 3 * 60 * 60 * 1000, 'twitter').should.equal('vor 3 Std.')
	})

	it(`should accept a string style argument`, function()
	{
		const time_ago = new javascript_time_ago('en')
		time_ago.format(Date.now(), 'twitter').should.equal('')
		time_ago.format(Date.now(), 'time').should.equal('just now')
		time_ago.format(Date.now(), 'exotic').should.equal('just now')
	})

	it(`should accept empty constructor parameters`, function()
	{
		const time_ago = new javascript_time_ago()
		time_ago.format(new Date()).should.equal('just now')
	})

	it(`should accept Dates`, function()
	{
		const time_ago = new javascript_time_ago('en')
		time_ago.format(new Date()).should.equal('just now')
	})

	it(`should not accept anything but Dates and timestamps`, function()
	{
		const time_ago = new javascript_time_ago('en')
		const thrower = () => time_ago.format('Jan 14, 2017')
		thrower.should.throw('Unsupported relative time formatter input: string, Jan 14, 2017')
	})

	it(`should return an empty string if the passed units are not available in locale data`, function()
	{
		const time_ago = new javascript_time_ago('en')
		time_ago.format(Date.now(), { units: ['femtosecond'] }).should.equal('')
	})

	it(`should return an empty string if no unit is suitable`, function()
	{
		const time_ago = new javascript_time_ago('en')
		const now = Date.now()

		// Remove 'now' unit formatting rule temporarily
		const just_now_formatter = javascript_time_ago.locales.en.long.now
		delete javascript_time_ago.locales.en.long.now

		time_ago.format(now, { now }).should.equal('')

		// Restore 'now' unit formating rule
		javascript_time_ago.locales.en.long.now = just_now_formatter
	})

	it(`should format for a style with "custom" function`, function()
	{
		const time_ago = new javascript_time_ago('en')

		// `custom` returns a string
		time_ago.format(Date.now(),
		{
			custom({ now, time, date, locale })
			{
				return locale
			}
		})
		.should.equal('en')

		// `custom` returns `undefined`
		time_ago.format(Date.now(),
		{
			custom({ now, time, date, locale })
			{
				return
			}
		})
		.should.equal('just now')
	})

	it(`should format Twitter style relative time (English)`, function()
	{
		const time_ago = new javascript_time_ago('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const elapsed = (time) => time_ago.format(now - time * 1000, { now, ...twitterStyle })

		elapsed(0).should.equal('')
		elapsed(44.9).should.equal('')
		elapsed(45.1).should.equal('1m')
		elapsed(1.49 * 60).should.equal('1m')
		elapsed(1.51 * 60).should.equal('2m')
		elapsed(2.49 * 60).should.equal('2m')
		elapsed(2.51 * 60).should.equal('3m')
		// …
		elapsed(59.49 * 60).should.equal('59m')
		elapsed(59.51 * 60).should.equal('1h')
		elapsed(1.49 * 60 * 60).should.equal('1h')
		elapsed(1.51 * 60 * 60).should.equal('2h')
		elapsed(2.49 * 60 * 60).should.equal('2h')
		elapsed(2.51 * 60 * 60).should.equal('3h')
		// …
		elapsed(23.49 * 60 * 60).should.equal('23h')
		elapsed(day + 2 * 60 + 60 * 60).should.equal('Apr 9')
		// …
		elapsed(year).should.equal('Apr 11, 2015')
	})

	it(`should format Twitter style relative time (Russian)`, function()
	{
		const time_ago = new javascript_time_ago(['ru'])

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const elapsed = time => time_ago.format(now - time * 1000, { now, ...twitterStyle })

		elapsed(0).should.equal('')
		elapsed(44.9).should.equal('')
		elapsed(45.1).should.equal('1м')
		elapsed(1.49 * 60).should.equal('1м')
		elapsed(1.51 * 60).should.equal('2м')
		elapsed(2.49 * 60).should.equal('2м')
		elapsed(2.51 * 60).should.equal('3м')
		// …
		elapsed(59.49 * 60).should.equal('59м')
		elapsed(59.51 * 60).should.equal('1ч')
		elapsed(1.49 * 60 * 60).should.equal('1ч')
		elapsed(1.51 * 60 * 60).should.equal('2ч')
		elapsed(2.49 * 60 * 60).should.equal('2ч')
		elapsed(2.51 * 60 * 60).should.equal('3ч')
		// …
		elapsed(23.49 * 60 * 60).should.equal('23ч')
		elapsed(day + 62 * 60).should.equal('9 апр.')
		// …
		elapsed(year).should.equal('11 апр. 2015 г.')
	})

	it(`should format "time" style relative time (English)`, function()
	{
		const time_ago = new javascript_time_ago('en-US')

		convenient_gradation_test
		([
			'just now',
			'1 minute',
			'2 minutes',
			'5 minutes',
			'10 minutes',
			'15 minutes',
			'20 minutes',
			'half an hour',
			'half an hour',
			'half an hour',
			'half an hour',
			'1 hour',
			'1 hour',
			'1 hour',
			'2 hours',
			'3 hours',
			'4 hours',
			'5 hours',
			'6 hours',
			'7 hours',
			'8 hours',
			'9 hours',
			'10 hours',
			'11 hours',
			'12 hours',
			'13 hours',
			'14 hours',
			'15 hours',
			'16 hours',
			'17 hours',
			'18 hours',
			'19 hours',
			'20 hours',
			'1 day',
			'2 days',
			'3 days',
			'4 days',
			'5 days',
			'1 week',
			'2 weeks',
			'3 weeks',
			'1 month',
			'2 months',
			'3 months',
			'4 months',
			'half a year',
			'half a year',
			'half a year',
			'half a year',
			'half a year',
			'1 year',
			'1 year',
			'1 year',
			'2 years',
			'3 years',
			'100 years'
		],
		time_ago,
		'time')
	})

	it(`should format "time" style relative time (Russian)`, function()
	{
		const time_ago = new javascript_time_ago('ru-RU')

		convenient_gradation_test
		([
			'только что',
			'1 минута',
			'2 минуты',
			'5 минут',
			'10 минут',
			'15 минут',
			'20 минут',
			'полчаса',
			'полчаса',
			'полчаса',
			'полчаса',
			'1 час',
			'1 час',
			'1 час',
			'2 часа',
			'3 часа',
			'4 часа',
			'5 часов',
			'6 часов',
			'7 часов',
			'8 часов',
			'9 часов',
			'10 часов',
			'11 часов',
			'12 часов',
			'13 часов',
			'14 часов',
			'15 часов',
			'16 часов',
			'17 часов',
			'18 часов',
			'19 часов',
			'20 часов',
			'1 день',
			'2 дня',
			'3 дня',
			'4 дня',
			'5 дней',
			'1 неделю',
			'2 недели',
			'3 недели',
			'1 месяц',
			'2 месяца',
			'3 месяца',
			'4 месяца',
			'полгода',
			'полгода',
			'полгода',
			'полгода',
			'полгода',
			'1 год',
			'1 год',
			'1 год',
			'2 года',
			'3 года',
			'100 лет'
		],
		time_ago,
		'time')
	})

	it(`should format time correctly for English language (short)`, function()
	{
		convenient_gradation_test
		([
			'now',
			'1 min. ago',
			'2 min. ago',
			'5 min. ago',
			'10 min. ago',
			'15 min. ago',
			'20 min. ago',
			'25 min. ago',
			'30 min. ago',
			'35 min. ago',
			'40 min. ago',
			'45 min. ago',
			'50 min. ago',
			'1 hr. ago',
			'2 hr. ago',
			'3 hr. ago',
			'4 hr. ago',
			'5 hr. ago',
			'6 hr. ago',
			'7 hr. ago',
			'8 hr. ago',
			'9 hr. ago',
			'10 hr. ago',
			'11 hr. ago',
			'12 hr. ago',
			'13 hr. ago',
			'14 hr. ago',
			'15 hr. ago',
			'16 hr. ago',
			'17 hr. ago',
			'18 hr. ago',
			'19 hr. ago',
			'20 hr. ago',
			'1 day ago',
			'2 days ago',
			'3 days ago',
			'4 days ago',
			'5 days ago',
			'1 wk. ago',
			'2 wk. ago',
			'3 wk. ago',
			'1 mo. ago',
			'2 mo. ago',
			'3 mo. ago',
			'4 mo. ago',
			'5 mo. ago',
			'6 mo. ago',
			'7 mo. ago',
			'8 mo. ago',
			'9 mo. ago',
			'9 mo. ago',
			'10 mo. ago',
			'1 yr. ago',
			'2 yr. ago',
			'3 yr. ago',
			'100 yr. ago'
		],
		new javascript_time_ago('en'),
		{ flavour: 'short' })
	})

	it(`should format time correctly for English language (long)`, function()
	{
		convenient_gradation_test
		([
			'just now',
			'a minute ago',
			'2 minutes ago',
			'5 minutes ago',
			'10 minutes ago',
			'15 minutes ago',
			'20 minutes ago',
			'half an hour ago',
			'half an hour ago',
			'half an hour ago',
			'half an hour ago',
			'an hour ago',
			'an hour ago',
			'an hour ago',
			'2 hours ago',
			'3 hours ago',
			'4 hours ago',
			'5 hours ago',
			'6 hours ago',
			'7 hours ago',
			'8 hours ago',
			'9 hours ago',
			'10 hours ago',
			'11 hours ago',
			'12 hours ago',
			'13 hours ago',
			'14 hours ago',
			'15 hours ago',
			'16 hours ago',
			'17 hours ago',
			'18 hours ago',
			'19 hours ago',
			'20 hours ago',
			'a day ago',
			'2 days ago',
			'3 days ago',
			'4 days ago',
			'5 days ago',
			'a week ago',
			'2 weeks ago',
			'3 weeks ago',
			'a month ago',
			'2 months ago',
			'3 months ago',
			'4 months ago',
			'half a year ago',
			'half a year ago',
			'half a year ago',
			'half a year ago',
			'half a year ago',
			'a year ago',
			'a year ago',
			'a year ago',
			'2 years ago',
			'3 years ago',
			'100 years ago'
		],
		new javascript_time_ago('en'))
	})

	it(`should format time correctly for Russian language (short)`, function()
	{
		convenient_gradation_test
		([
			'только что',
			'1 мин. назад',
			'2 мин. назад',
			'5 мин. назад',
			'10 мин. назад',
			'15 мин. назад',
			'20 мин. назад',
			'25 мин. назад',
			'30 мин. назад',
			'35 мин. назад',
			'40 мин. назад',
			'45 мин. назад',
			'50 мин. назад',
			'1 ч. назад',
			'2 ч. назад',
			'3 ч. назад',
			'4 ч. назад',
			'5 ч. назад',
			'6 ч. назад',
			'7 ч. назад',
			'8 ч. назад',
			'9 ч. назад',
			'10 ч. назад',
			'11 ч. назад',
			'12 ч. назад',
			'13 ч. назад',
			'14 ч. назад',
			'15 ч. назад',
			'16 ч. назад',
			'17 ч. назад',
			'18 ч. назад',
			'19 ч. назад',
			'20 ч. назад',
			'1 д. назад',
			'2 дн. назад',
			'3 дн. назад',
			'4 дн. назад',
			'5 дн. назад',
			'1 нед. назад',
			'2 нед. назад',
			'3 нед. назад',
			'1 мес. назад',
			'2 мес. назад',
			'3 мес. назад',
			'4 мес. назад',
			'5 мес. назад',
			'6 мес. назад',
			'7 мес. назад',
			'8 мес. назад',
			'9 мес. назад',
			'9 мес. назад',
			'10 мес. назад',
			'1 г. назад',
			'2 г. назад',
			'3 г. назад',
			'100 л. назад'
		],
		new javascript_time_ago('ru'),
		{ flavour: 'short' })
	})

	it(`should format time correctly for Russian language (long)`, function()
	{
		convenient_gradation_test
		([
			'только что',
			'минуту назад',
			'2 минуты назад',
			'5 минут назад',
			'10 минут назад',
			'15 минут назад',
			'20 минут назад',
			'полчаса назад',
			'полчаса назад',
			'полчаса назад',
			'полчаса назад',
			'час назад',
			'час назад',
			'час назад',
			'2 часа назад',
			'3 часа назад',
			'4 часа назад',
			'5 часов назад',
			'6 часов назад',
			'7 часов назад',
			'8 часов назад',
			'9 часов назад',
			'10 часов назад',
			'11 часов назад',
			'12 часов назад',
			'13 часов назад',
			'14 часов назад',
			'15 часов назад',
			'16 часов назад',
			'17 часов назад',
			'18 часов назад',
			'19 часов назад',
			'20 часов назад',
			'день назад',
			'2 дня назад',
			'3 дня назад',
			'4 дня назад',
			'5 дней назад',
			'неделю назад',
			'2 недели назад',
			'3 недели назад',
			'месяц назад',
			'2 месяца назад',
			'3 месяца назад',
			'4 месяца назад',
			'полгода назад',
			'полгода назад',
			'полгода назад',
			'полгода назад',
			'полгода назад',
			'год назад',
			'год назад',
			'год назад',
			'2 года назад',
			'3 года назад',
			'100 лет назад'
		],
		new javascript_time_ago('ru'))
	})

	it(`should format future dates`, function()
	{
		new javascript_time_ago('en').format(Date.now() + 60 * 60 * 1000).should.equal('in an hour')
		new javascript_time_ago('ru').format(Date.now() + 45 * 1000).should.equal('через минуту')
	})
})

function convenient_gradation_test(convenient_gradation_labels, time_ago, style = {})
{
	if (typeof style === 'string')
	{
		switch (style)
		{
			case 'twitter':
				style = twitterStyle
				break
			case 'time':
				style = timeStyle
				break
		}
	}

	const now = Date.now()
	const elapsed = time => time_ago.format(now - time * 1000, { now, ...style })

	if (convenient_gradation.length !== convenient_gradation_labels.length)
	{
		throw new Error(`Array length mismatch. Gradation steps: ${convenient_gradation.length}, labels: ${convenient_gradation_labels.length}`)
	}

	let i = 0
	while (i < convenient_gradation.length)
	{
		for (let time of convenient_gradation[i])
		{
			elapsed(time).should.equal(convenient_gradation_labels[i])
		}

		i++
	}
}

const convenient_gradation =
[
	// 'just now':
	[
		0,
		44.9
	],
	// 'a minute ago':
	[
		45.1,
		1.49 * 60
	],
	// '2 minutes ago':
	[
		1.51 * 60,
		2.49 * 60
	],
	// '5 minutes ago':
	[
		2.51 * 60,
		7.49 * 60
	],
	// '10 minutes ago':
	[
		7.51  * 60,
		12.49 * 60
	],
	// '15 minutes ago':
	[
		12.51 * 60,
		17.49 * 60
	],
	// '20 minutes ago':
	[
		17.51 * 60,
		22.49 * 60
	],
	// '25 minutes ago':
	[
		22.51 * 60,
		27.49 * 60
	],
	// '30 minutes ago':
	[
		27.51 * 60,
		32.49 * 60
	],
	// '35 minutes ago':
	[
		32.51 * 60,
		37.49 * 60
	],
	// '40 minutes ago':
	[
		37.51 * 60,
		42.49 * 60
	],
	// '45 minutes ago':
	[
		42.51 * 60,
		47.49 * 60
	],
	// '50 minutes ago':
	[
		47.51 * 60,
		52.49 * 60
	],
	// 'an hour ago':
	[
		55.01 * 60,
		1.49  * 60 * 60
	],
	// '2 hours ago':
	[
		1.51  * 60 * 60,
		2.49  * 60 * 60
	],
	// '3 hours ago':
	[
		2.51  * 60 * 60,
		3.49  * 60 * 60
	],
	// '4 hours ago':
	[
		3.51  * 60 * 60,
		4.49  * 60 * 60
	],
	// '5 hours ago':
	[
		4.51  * 60 * 60,
		5.49  * 60 * 60
	],
	// '6 hours ago':
	[
		5.51  * 60 * 60,
		6.49  * 60 * 60
	],
	// '7 hours ago':
	[
		6.51  * 60 * 60,
		7.49  * 60 * 60
	],
	// '8 hours ago':
	[
		7.51  * 60 * 60,
		8.49  * 60 * 60
	],
	// '9 hours ago':
	[
		8.51  * 60 * 60,
		9.49  * 60 * 60
	],
	// '10 hours ago':
	[
		9.51  * 60 * 60,
		10.49 * 60 * 60
	],
	// '11 hours ago':
	[
		10.51 * 60 * 60,
		11.49 * 60 * 60
	],
	// '12 hours ago':
	[
		11.51 * 60 * 60,
		12.49 * 60 * 60
	],
	// '13 hours ago':
	[
		12.51 * 60 * 60,
		13.49 * 60 * 60
	],
	// '14 hours ago':
	[
		13.51 * 60 * 60,
		14.49 * 60 * 60
	],
	// '15 hours ago':
	[
		14.51 * 60 * 60,
		15.49 * 60 * 60
	],
	// '16 hours ago':
	[
		15.51 * 60 * 60,
		16.49 * 60 * 60
	],
	// '17 hours ago':
	[
		16.51 * 60 * 60,
		17.49 * 60 * 60
	],
	// '18 hours ago':
	[
		17.51 * 60 * 60,
		18.49 * 60 * 60
	],
	// '19 hours ago':
	[
		18.51 * 60 * 60,
		19.49 * 60 * 60
	],
	// '20 hours ago':
	[
		19.51 * 60 * 60,
		20.49 * 60 * 60
	],
	// 'a day ago':
	[
		20.51 * 60 * 60,
		1.49  * day
	],
	// '2 days ago':
	[
		1.51  * day,
		2.49  * day
	],
	// '3 days ago':
	[
		2.51  * day,
		3.49  * day
	],
	// '4 days ago':
	[
		3.51  * day,
		4.49  * day
	],
	// '5 days ago':
	[
		4.51  * day,
		5.49  * day
	],
	// 'a week ago':
	[
		5.51  * day,
		1.49  * 7 * day
	],
	// '2 weeks ago':
	[
		1.51  * 7 * day,
		2.49  * 7 * day
	],
	// '3 weeks ago':
	[
		2.51  * 7 * day,
		3.49  * 7 * day
	],
	// 'a month ago':
	[
		3.51  * 7 * day,
		1.49  * month
	],
	// '2 months ago':
	[
		1.51  * month,
		2.49  * month
	],
	// '3 months ago':
	[
		2.51  * month,
		3.49  * month
	],
	// '4 months ago':
	[
		3.51  * month,
		4.49  * month
	],
	// '5 months ago':
	[
		4.51  * month,
		5.49  * month
	],
	// '6 months ago':
	[
		5.51  * month,
		6.49  * month
	],
	// '7 months ago':
	[
		6.51  * month,
		7.49  * month
	],
	// '8 months ago':
	[
		7.51  * month,
		8.49  * month
	],
	// '9 months ago':
	[
		8.51  * month,
		8.99  * month
	],
	// '9 months ago':
	[
		9.01  * month,
		9.49  * month
	],
	// '10 months ago':
	[
		9.51  * month,
		10.49  * month
	],
	// 'a year ago':
	[
		10.51 * month,
		1.49  * year
	],
	// '2 years ago':
	[
		1.51  * year,
		2.49  * year
	],
	// '3 years ago':
	[
		2.51  * year,
		3.49  * year
	],
	// '100 years ago':
	[
		99.51  * year,
		100.49 * year
	]
]