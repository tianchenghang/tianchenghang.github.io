.PHONY: cjs, esm1, esm2, esm3

cjs:
	node ./src/circle/main.cjs

esm1:
	node ./src/circle/main.mjs

esm2:
	node ./src/circle/first.mjs

esm3:
	node ./src/circle/third.mjs