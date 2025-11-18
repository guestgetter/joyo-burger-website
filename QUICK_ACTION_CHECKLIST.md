# JOYO Burger - Quick Action Checklist

## 🔥 DO THIS NOW (Time-Sensitive)

### Step 1: Submit for Google Re-Indexing (5 minutes)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "URL Inspection" in left sidebar
3. Enter and submit these URLs one by one:
   - [ ] `https://joyoburger.com/`
   - [ ] `https://joyoburger.com/index-en.html`
   - [ ] `https://joyoburger.com/menu.html`
   - [ ] `https://joyoburger.com/menu-fr.html`
   - [ ] `https://joyoburger.com/rosemont-masson-location.html`
   - [ ] `https://joyoburger.com/verdun-wellington.html`

4. For each URL:
   - Click "Test Live URL"
   - Wait for result
   - Click "Request Indexing"
   - Wait for confirmation

5. Submit updated sitemap:
   - Go to "Sitemaps" in left sidebar
   - Enter: `sitemap.xml`
   - Click "Submit"

**⏱️ Expected Timeline:** Changes appear in Google within 1-48 hours

---

## 📊 Step 2: Validate Everything (10 minutes)

### Test Rich Results

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Test these URLs:
   - [ ] `https://joyoburger.com/`
   - [ ] `https://joyoburger.com/index-en.html`
   - [ ] `https://joyoburger.com/rosemont-masson-location.html`

3. For each, verify:
   - ✅ "Restaurant" detected
   - ✅ "WebSite" detected
   - ✅ "SiteNavigationElement" detected
   - ✅ No errors (warnings are OK)

### Test Schema Validator

1. Go to [Schema.org Validator](https://validator.schema.org/)
2. Test: `https://joyoburger.com/`
3. Verify:
   - ✅ All properties recognized
   - ✅ No errors

---

## 📍 Step 3: Update Google Business Profile (15 minutes)

### For BOTH Locations (Rosemont & Verdun)

1. Log into [Google Business Profile](https://business.google.com/)

2. **Add/Update Menu URL:**
   - [ ] Rosemont: `https://joyoburger.com/menu.html`
   - [ ] Verdun: `https://joyoburger.com/menu.html`

3. **Add/Update Order URL:**
   - [ ] Both: `https://order.ueat.io/integration/ed824cce-5687-4ec8-aa2b-68f92e7dcff7/fr#/`

4. **Upload Menu Photos:**
   - [ ] At least 5-10 food photos
   - [ ] Label each with item name and price
   - [ ] Include: Burgers, Fries, Drinks, Desserts

5. **Add Menu Items:**
   - [ ] Le Classic burger
   - [ ] The Big burger
   - [ ] Frites Maison
   - [ ] Poutine Classique
   - [ ] Milkshakes
   - (Add prices for each)

6. **Verify Categories:**
   - [ ] Primary: "Burger Restaurant"
   - [ ] Add: "Fast Food Restaurant"
   - [ ] Add: "Halal Restaurant" (if certified)

7. **Complete Business Info:**
   - [ ] Hours of operation (11:00-22:00)
   - [ ] Phone numbers
   - [ ] Service options: Dine-in, Takeout, Delivery
   - [ ] Payment methods accepted

**🎯 Why This Matters:** GBP + Website structured data = Best search results

---

## 📈 Step 4: Monitor Results (Next 7 Days)

### Daily Checks (30 seconds each)

**Day 1-2:**
- [ ] Check if pages are re-indexed (Search Console → Coverage)
- [ ] Search "joyo burger montreal" - check appearance

**Day 3-5:**
- [ ] Compare search result to KOMA Restaurant
- [ ] Search "joyo burger rosemont" - check location card
- [ ] Search "joyo burger verdun" - check location card

**Day 6-7:**
- [ ] Check Google Search Console for:
  - Impressions (should increase)
  - CTR (should increase)
  - Valid structured data items

### What to Look For in Google Search

✅ **Success Indicators:**
- Single unified result (not 2 separate listings)
- Action buttons: "Order Online", "View Menu", "Contact"
- Structured sitelinks showing Menu, Locations, About
- Enhanced information panel
- Menu photos in carousel
- Direct call button
- Hours, ratings prominently displayed

❌ **If Still Not Showing:**
- See "Troubleshooting" section in comprehensive report
- May need to re-submit or wait longer (up to 14 days max)

---

## 📋 Quick Reference: What Was Fixed

✅ **Added SiteNavigationElement** (6 navigation items)
✅ **Removed fake SearchAction** (was pointing to non-existent search)
✅ **Added @id values** (unique identifiers for all entities)
✅ **Added parentOrganization** (links locations to main restaurant)
✅ **Added potentialAction** (4 action types for buttons)
✅ **Added contactPoint** (both locations with language support)
✅ **Updated sitemap.xml** (all timestamps to 2025-11-18, added missing pages)
✅ **Enhanced department URLs** (explicit URLs for both locations)

**Total Files Modified:** 8
- 3 homepage versions (index.html, index-en.html, index-fr.html)
- 4 location pages
- 1 sitemap.xml

---

## 🎯 Success Metrics to Track

| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| Google impressions | (Current) | +20% | 30 days |
| Click-through rate | (Current) | +15% | 30 days |
| Rich result appearance | No | Yes | 7 days |
| Knowledge panel | No | Maybe | 60 days |
| Voice search results | Low | Higher | 90 days |

---

## ❓ Quick FAQ

**Q: How long until I see changes?**
A: 1-7 days after re-indexing, typically 2-3 days.

**Q: What if nothing changes after 7 days?**
A: Check troubleshooting guide in comprehensive report, ensure GBP is complete, re-submit URLs again.

**Q: Will this affect my current rankings?**
A: No negative impact. Only improves appearance and CTR.

**Q: Do I need to do this for the dist/ folder too?**
A: No, dist/ is the build output. Changes to source files will propagate.

**Q: Can I undo if something goes wrong?**
A: Yes, via git revert. But these changes follow Google best practices.

---

## 📧 Need Help?

If you encounter issues:
1. Check comprehensive report: `COMPREHENSIVE_SEO_ENHANCEMENT_REPORT.md`
2. Validate schemas: [Rich Results Test](https://search.google.com/test/rich-results)
3. Check Search Console for specific errors
4. Ensure GBP is fully completed

---

## ✅ Completion Checklist

Mark when complete:

- [ ] Step 1: Submitted all URLs for re-indexing ⏱️ (5 min)
- [ ] Step 2: Validated structured data ⏱️ (10 min)
- [ ] Step 3: Updated Google Business Profile ⏱️ (15 min)
- [ ] Step 4: Set up monitoring schedule ⏱️ (2 min)

**Total Time Required: ~32 minutes**

---

**Status: Ready for Deployment** ✅

All technical work is complete. The above steps activate the enhancements.
