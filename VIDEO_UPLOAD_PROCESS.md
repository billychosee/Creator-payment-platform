# Video Upload Process (Text Format)

1. Start

User begins the flow.

2. User Action

User selects “Upload Video”.

3. Load Form

System loads `UploadVideoForm()`.

4. Collect Form Fields

The user fills in the following fields:

- `videoName`
- `videoDescription`
- `releaseYear`
- `thumbnailImage`
- `language`
- `abuseFlag` (boolean)
- `moderationAction` (`blocked` | boolean)
- `trailerFile` (optional)
- `mainVideoFile` (required)
- `paymentType` (`per_view` | `free`)
- `currency` (`USD` | `ZIG`)
- `price` (required if `paymentType = per_view`)

5. Submit

User clicks “Upload”.

System calls `Video.upload(formInput)`.

---

Validation Phase

6. Validate Required Fields

- If NO → Show validation errors → Return to form
- If YES → Continue

7. Check Payment Type

- If `paymentType == "per_view"`:
  - Validate `price > 0`
  - If NO → Show error: "Invalid or missing price"
  - If YES → Continue
- If `paymentType != "per_view"`:
  - Set `price = 0` or omit it

---

Processing Phase

8. Proceed

Continue to video processing.

9. Extract Video Resolution

Call `VideoProcessingService.extractResolution(mainVideoFile)`

Resolution detected (e.g., `480p`, `720p`, `1080p`)

10. Save Thumbnail

Call `saveThumbnailToS3(thumbnailImage)`

Optional Trailer Upload

11. Trailer Check

- Is `trailerFile` provided?
  - Yes → `saveTrailerToS3(trailerFile)`
  - No → Skip trailer upload

Save Video & Metadata

12. Save Main Video

Call `saveVideoToS3(mainVideoFile)`

13. Create Content Record

Call:

```
ContentService.create({
  channelId: selectedChannel,
  playlistId: optionalPlaylist,
  creatorId: currentUser,
  videoName,
  videoDescription,
  releaseYear,
  thumbnailUrl,
  trailerUrl,
  videoUrl,
  language,
  paymentType,
  price,
  resolution,
  status: "draft"
})
```

Final Step

14. Playlist Prompt

Prompt user: “Select or create playlist to continue”

15. End

Upload flow ends.
