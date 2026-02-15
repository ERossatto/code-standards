# Simple curl helpers for the presentation-layer API
# Quickstart:
#   1) make token.generate   # copy the printed JWT
#   2) Paste it into TOKEN below
#   3) make municipalities.create   # run any command with defaults

.PHONY: help token.generate municipalities.create municipalities.get prices.create prices.history prices.current prices.by_package packages.create packages.add_price

# Base configuration
BASE_URL ?= http://localhost:3000
# Paste a valid JWT here after running `make token.generate`
TOKEN ?= eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJwZXJtaXNzaW9ucyI6WyJtdW5pY2lwYWxpdHk6cmVhZCIsIm11bmljaXBhbGl0eTpjcmVhdGUiLCJwcmljZTpyZWFkIiwicHJpY2U6Y3JlYXRlIiwicGFja2FnZTpjcmVhdGUiXSwianRpIjoiY2Q4NmY4ZWQtN2Y4MC00ODFjLWJjODQtZGZjNzVmY2ExYjZiIiwiaWF0IjoxNzcxMTc3MzUyLCJleHAiOjE3NzExODA5NTJ9.GzirmK4NDH7vARzAaBmJ6-xKUeYzEoOMSMX3IMAJ6K4

# Common data
NOW_DATE ?= 2025-09-24
MUNICIPALITY_ID ?= 342d181c-fda3-450c-a378-e5217ebaed64
MUNICIPALITY_NAME ?= Santos
MUNICIPALITY_CODE ?= 0013
MUNICIPALITY_COUNTRY ?= Brazil
PACKAGE_TYPE ?= Basic
VALUE_CENTS ?= 2000
CURRENCY ?= BRL
EFFECTIVE_DATE ?= $(NOW_DATE)
YEAR ?= 2025

help:
	@echo "Available targets:"
	@echo "  make token.generate                         # prints a JWT (copy/paste into TOKEN)"
	@echo "  make municipalities.create                  # creates default municipality"
	@echo "  make municipalities.get                     # gets municipality by name"
	@echo "  make prices.create                           # creates a price"
	@echo "  make prices.history                          # price history"
	@echo "  make prices.current                          # current price"
	@echo "  make prices.by_package                       # all prices for package type"
	@echo "  make packages.create                         # create package with initial price"
	@echo "  make packages.add_price                      # add price to existing package"
	@echo ""
	@echo "Note: First run: make token.generate, then paste token into TOKEN in this Makefile."
	@echo "      JWT is signed with JWT_SECRET or 'dev-secret' if unset."

# -------------------- Token generator --------------------
token.generate:
	@echo "Generating JWT using njwt..." >&2
	@node -e "const nJwt=require('njwt');const s=process.env.JWT_SECRET||'dev-secret';const claims={sub:'demo-user',permissions:['municipality:read','municipality:create','price:read','price:create','package:create']};const t=nJwt.create(claims,s);console.log(t.compact());"

# -------------------- Municipalities --------------------


municipalities.create:
	@echo "POST /api/municipalities"
	curl -sS -X POST "$(BASE_URL)/api/municipalities" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"name":"$(MUNICIPALITY_NAME)","code":"$(MUNICIPALITY_CODE)","country":"$(MUNICIPALITY_COUNTRY)"}'

municipalities.get:
	@echo "GET /api/municipalities/$(MUNICIPALITY_NAME)"
	curl -sS "$(BASE_URL)/api/municipalities/$(MUNICIPALITY_NAME)" \
	  -H "Authorization: Bearer $(TOKEN)"

# -------------------- Prices --------------------


prices.create:
	@echo "POST /api/prices"
	curl -sS -X POST "$(BASE_URL)/api/prices" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"packageType":"$(PACKAGE_TYPE)","valueCents":$(VALUE_CENTS),"currency":"$(CURRENCY)","effectiveDate":"$(EFFECTIVE_DATE)","municipalityName":"$(MUNICIPALITY_NAME)"}'

prices.history:
	@echo "GET /api/prices/history?packageType=$(PACKAGE_TYPE)&year=$(YEAR)"
	curl -sS "$(BASE_URL)/api/prices/history?packageType=$(PACKAGE_TYPE)&year=$(YEAR)" \
	  -H "Authorization: Bearer $(TOKEN)"

prices.current:
	@echo "GET /api/prices/current?packageType=$(PACKAGE_TYPE)&municipalityId=$(MUNICIPALITY_ID)"
	curl -sS "$(BASE_URL)/api/prices/current?packageType=$(PACKAGE_TYPE)&municipalityId=$(MUNICIPALITY_ID)" \
	  -H "Authorization: Bearer $(TOKEN)"

prices.by_package:
	@echo "GET /api/prices/package/$(PACKAGE_TYPE)"
	curl -sS "$(BASE_URL)/api/prices/package/$(PACKAGE_TYPE)" \
	  -H "Authorization: Bearer $(TOKEN)"

# -------------------- Packages --------------------
packages.create:
	@echo "POST /api/packages"
	curl -sS -X POST "$(BASE_URL)/api/packages" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"packageType":"$(PACKAGE_TYPE)","valueCents":$(VALUE_CENTS),"currency":"$(CURRENCY)","effectiveDate":"$(EFFECTIVE_DATE)","municipalityName":"$(MUNICIPALITY_NAME)"}'

packages.add_price:
	@echo "POST /api/packages/$(PACKAGE_TYPE)/price"
	curl -sS -X POST "$(BASE_URL)/api/packages/$(PACKAGE_TYPE)/price" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"packageType":"$(PACKAGE_TYPE)","valueCents":$(VALUE_CENTS),"currency":"$(CURRENCY)","effectiveDate":"$(EFFECTIVE_DATE)","municipalityName":"$(MUNICIPALITY_NAME)"}'


