package com.Cert.certinsync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BatchCleanupScheduler {

    @Autowired
    private BatchService batchService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void cleanup() {
        batchService.cleanupExpiredBatches();
    }
}
