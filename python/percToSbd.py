import sys
from beem import Steem
steem = Steem("https://api.steemit.com")

_sp = float(sys.argv[1])
_prs = int(sys.argv[2])
_vp = int(sys.argv[3])
_pct = int(sys.argv[4])


# sbdParam = float(_sbd) + " SBD"
val = steem.sp_to_sbd(_sp,_prs,_vp,_pct,not_broadcasted_vote=True)

print(val)

steem.sp_to_sbd()