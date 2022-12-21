import * as util from './util'

const html = `<article><p>That's the right answer!  You are <span class="day-success">one gold star</span> closer to saving your vacation.</p><p>You have completed Day 2! You can <span class="share">[Share<span class="share-content">on
<a href="https://twitter.com/intent/tweet?text=I+just+completed+%22Password+Philosophy%22+%2D+Day+2+%2D+Advent+of+Code+2020&amp;url=https%3A%2F%2Fadventofcode%2Ecom%2F2020%2Fday%2F2&amp;related=ericwastl&amp;hashtags=AdventOfCode" target="_blank">Twitter</a>
<a href="javascript:void(0);" onclick="var mastodon_instance=prompt('Mastodon Instance / Server Name?'); if(typeof mastodon_instance==='string' && mastodon_instance.length){this.href='https://'+mastodon_instance+'/share?text=I+just+completed+%22Password+Philosophy%22+%2D+Day+2+%2D+Advent+of+Code+2020+%23AdventOfCode+https%3A%2F%2Fadventofcode%2Ecom%2F2020%2Fday%2F2'}else{return false;}" target="_blank">Mastodon</a
></span>]</span> this victory or <a href="/2020">[Return to Your Advent Calendar]</a>.</p></article>`

console.log(util.dehtml(html))
